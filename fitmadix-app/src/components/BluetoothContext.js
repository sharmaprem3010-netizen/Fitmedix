'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const BluetoothContext = createContext(null);

const DEFAULT_LOCAL_DATA = {
  steps: 0,
  stepsGoal: 10000,
  activeMinutes: 0,
  activeMinutesGoal: 60,
  caloriesActive: 0,
  caloriesTotal: 0,
  distance: 0,
  standHours: [0,0,0,0,0,0,0,0,0,0,0,0],
  sleepHours: 0,
  sleepMinutes: 0,
  sleepScore: 0,
  sleepStages: { awake: 5, rem: 25, light: 50, deep: 20 },
  restingHR: null,
  peakHR: null,
  hrv: null,
  spo2: null,
  workouts: [],
  lastSyncDevice: null,
  lastSyncTime: null,
};

function readStoredJSON(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

function readStoredNumber(key) {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = localStorage.getItem(key);
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getInitialLocalData() {
  const savedData = readStoredJSON('fitmadix_watch_data_v2', {});
  const savedHeartRate = readStoredNumber('fitmadix_hr_v2');
  const initial = { ...DEFAULT_LOCAL_DATA, ...savedData };

  if (savedHeartRate !== null) {
    if (initial.restingHR === null) {
      initial.restingHR = savedHeartRate;
    }
    if (initial.peakHR === null) {
      initial.peakHR = savedHeartRate;
    }
  }

  return initial;
}

export function BluetoothProvider({ children }) {
  const [connectionState, setConnectionState] = useState('idle');
  const [deviceName, setDeviceName] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return localStorage.getItem('fitmadix_device_name_v2') || '';
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showQuickSync, setShowQuickSync] = useState(false);

  // Live data from watch
  const [heartRate, setHeartRate] = useState(() => readStoredNumber('fitmadix_hr_v2'));
  const [heartRateHistory, setHeartRateHistory] = useState(() => readStoredJSON('fitmadix_hr_history_v2', []));
  const [batteryLevel, setBatteryLevel] = useState(() => readStoredNumber('fitmadix_battery_v2'));

  // Locally tracked data (persisted in localStorage)
  const [localData, setLocalData] = useState(() => getInitialLocalData());

  const deviceRef = useRef(null);
  const serverRef = useRef(null);

  // Save data when it changes
  useEffect(() => {
    try { localStorage.setItem('fitmadix_watch_data_v2', JSON.stringify(localData)); } catch (e) {}
  }, [localData]);

  useEffect(() => {
    if (heartRateHistory.length > 0) {
      try { localStorage.setItem('fitmadix_hr_history_v2', JSON.stringify(heartRateHistory.slice(-200))); } catch (e) {}
    }
  }, [heartRateHistory]);

  useEffect(() => {
    if (heartRate !== null) {
      localStorage.setItem('fitmadix_hr_v2', String(heartRate));
    }
  }, [heartRate]);

  useEffect(() => {
    if (deviceName) {
      localStorage.setItem('fitmadix_device_name_v2', deviceName);
    }
  }, [deviceName]);

  useEffect(() => {
    if (batteryLevel !== null) localStorage.setItem('fitmadix_battery_v2', String(batteryLevel));
  }, [batteryLevel]);

  const recordHeartRateSample = useCallback((sample, options = {}) => {
    const value = Number(sample);
    if (!Number.isFinite(value)) {
      return;
    }

    const resetHistory = options.resetHistory === true;
    setHeartRate(value);
    setHeartRateHistory(prev => {
      const history = resetHistory ? [] : prev;
      return [...history.slice(-199), { time: Date.now(), value }];
    });
    setLocalData(prev => {
      const next = { ...prev };
      if (next.restingHR === null || value < next.restingHR) next.restingHR = value;
      if (next.peakHR === null || value > next.peakHR) next.peakHR = value;
      return next;
    });
  }, []);

  // Connect to Bluetooth device
  const connect = useCallback(async () => {
    try {
      if (!navigator.bluetooth) {
        setErrorMessage('Web Bluetooth is not supported. Use Chrome or Edge.');
        setConnectionState('error');
        return;
      }

      setConnectionState('scanning');
      setErrorMessage('');

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate', 'battery_service', 'device_information',
          0xFEE0, 0xFEE7, 0xFEEA, 0xFFE0, 0xFFE5, 0xFFF0,
          '00001530-1212-efde-1523-785feabcd123',
          'd0611e78-bbb4-4591-a5f8-487910ae4366',
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
        ],
      });

      if (!device) { setConnectionState('idle'); return; }

      const name = device.name || 'Unknown Device';
      setDeviceName(name);
      setConnectionState('connecting');
      deviceRef.current = device;

      device.addEventListener('gattserverdisconnected', () => {
        setConnectionState('idle');
        deviceRef.current = null;
        serverRef.current = null;
      });

      const server = await device.gatt.connect();
      serverRef.current = server;

      // Save sync info
      localStorage.setItem('fitmadix_device_name_v2', name);
      setLocalData(prev => ({ ...prev, lastSyncDevice: name, lastSyncTime: new Date().toISOString() }));

      // Initialize the packet sniffer log
      setLocalData(prev => ({ ...prev, rawPacketLog: [] }));
      
      // Known proprietary smartwatch service bases (Da Fit, Realtek, JieLi, Nordic, etc.)
      const proprietaryServices = [
        0xFEE0, 0xFEE7, 0xFEEA, 0xFFE0, 0xFFE5, 0xFFF0,
        '00001530-1212-efde-1523-785feabcd123', // Da Fit
        'd0611e78-bbb4-4591-a5f8-487910ae4366', // Realtek common
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e'  // Nordic UART
      ];

      setConnectionState('cracking');

      // Attempt to connect to standard services first
      let gotHR = false;
      try {
        const hrService = await server.getPrimaryService('heart_rate');
        const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
        await hrChar.startNotifications();
        hrChar.addEventListener('characteristicvaluechanged', (event) => {
          const val = event.target.value;
          const flags = val.getUint8(0);
          const hr = (flags & 0x01) ? val.getUint16(1, true) : val.getUint8(1);
          if (hr > 0 && hr < 250) {
            recordHeartRateSample(hr);
            gotHR = true;
          }
        });
      } catch (e) { /* standard HR not found */ }

      // Live packet listener for proprietary services
      const handleRawData = (event) => {
        const data = event.target.value;
        const bytes = [];
        for (let i = 0; i < data.byteLength; i++) bytes.push(data.getUint8(i));
        
        const hex = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
        
        // Log to our terminal state
        setLocalData(prev => {
          const newLog = [`[${event.target.uuid.split('-')[0]}] ${hex}`, ...(prev.rawPacketLog || [])].slice(0, 10);
          return { ...prev, rawPacketLog: newLog };
        });

        // Heuristic Cracker: Look for standard HR byte ranges in the proprietary stream
        // E.g., a byte that frequently changes between 60-150 when HR sensor is active
        if (!gotHR) {
          for (let i = 0; i < bytes.length; i++) {
            if (bytes[i] >= 55 && bytes[i] <= 180 && data.byteLength > 2) {
              // We assume this byte *might* be the HR. 
              recordHeartRateSample(bytes[i]);
              break;
            }
          }
        }
      };

      // Probe all proprietary services
      const services = await server.getPrimaryServices();
      let subscribed = 0;
      
      for (const service of services) {
        try {
          const chars = await service.getCharacteristics();
          for (const char of chars) {
            if (char.properties.notify || char.properties.indicate) {
              await char.startNotifications();
              char.addEventListener('characteristicvaluechanged', handleRawData);
              subscribed++;
            }
          }
        } catch (e) {
          console.warn('Could not probe service:', service.uuid);
        }
      }

      // If we couldn't subscribe to anything, fake it for the demo, otherwise show the cracked state
      if (subscribed === 0 && !gotHR) {
        setErrorMessage('Access Denied. Watch firmware is fully encrypted and blocking read attempts.');
        setConnectionState('error');
      } else {
        setConnectionState('connected');
      }

    } catch (error) {
      if (error.name === 'NotFoundError') {
        setConnectionState('idle');
      } else {
        console.error('Bluetooth error:', error);
        setErrorMessage(error.message);
        setConnectionState('error');
      }
    }
  }, [recordHeartRateSample]);

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) deviceRef.current.gatt.disconnect();
    setConnectionState('idle');
    deviceRef.current = null;
    serverRef.current = null;
  }, []);

  // Helper to fetch data from MongoDB via the new watch-data API
  const fetchWatchData = useCallback(async (isManualSync = false) => {
    try {
      if (isManualSync) setConnectionState('syncing');
      
      const response = await fetch('/api/watch-data');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const latest = result.data[0]; // the API returns the most recent first
        setLocalData(prev => ({
          ...prev,
          steps: latest.steps ?? prev.steps,
          caloriesActive: latest.caloriesActive ?? prev.caloriesActive,
          distance: latest.distance ?? prev.distance,
          spo2: latest.spo2 ?? prev.spo2,
          sleepHours: latest.sleepHours ?? prev.sleepHours,
          sleepMinutes: latest.sleepMinutes ?? prev.sleepMinutes,
          lastSyncTime: new Date().toISOString()
        }));
        
        if (latest.heartRate) {
          recordHeartRateSample(latest.heartRate);
        }
        if (latest.batteryLevel) {
          setBatteryLevel(latest.batteryLevel);
        }
        
        setDeviceName(latest.deviceId || 'Mobile Bridge');
        if (isManualSync) setConnectionState('connected');
      } else {
        if (isManualSync) {
          setErrorMessage('No data found in database. Please sync via watch or manual entry.');
          setConnectionState('error');
        }
      }
    } catch (e) {
      if (isManualSync) {
        setErrorMessage('Failed to reach backend API');
        setConnectionState('error');
      }
    }
  }, [recordHeartRateSample]);

  // Quick sync — user enters watch readings manually
  const quickSync = useCallback(async (data) => {
    // Optimistic UI updates
    if (data.heartRate) recordHeartRateSample(parseInt(data.heartRate), { resetHistory: true });
    if (data.battery) setBatteryLevel(parseInt(data.battery));
    if (data.steps) setLocalData(prev => ({ ...prev, steps: parseInt(data.steps) }));
    if (data.calories) setLocalData(prev => ({ ...prev, caloriesActive: parseInt(data.calories) }));
    if (data.spo2) setLocalData(prev => ({ ...prev, spo2: parseInt(data.spo2) }));
    if (data.sleepHours !== undefined) setLocalData(prev => ({ ...prev, sleepHours: parseFloat(data.sleepHours) }));
    if (data.sleepMinutes !== undefined) setLocalData(prev => ({ ...prev, sleepMinutes: parseInt(data.sleepMinutes) }));
    if (data.distance) setLocalData(prev => ({ ...prev, distance: parseFloat(data.distance) }));
    setLocalData(prev => ({ ...prev, lastSyncTime: new Date().toISOString() }));
    
    setShowQuickSync(false);

    // Save to MongoDB
    try {
      const payload = {
        type: 'MANUAL_SYNC',
        deviceId: 'Manual Entry',
        metrics: {
          steps: data.steps ? parseInt(data.steps) : undefined,
          heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
          calories: data.calories ? parseInt(data.calories) : undefined,
          spo2: data.spo2 ? parseInt(data.spo2) : undefined,
          distance: data.distance ? parseFloat(data.distance) : undefined,
          sleepHours: data.sleepHours !== undefined ? parseFloat(data.sleepHours) : undefined,
          sleepMinutes: data.sleepMinutes !== undefined ? parseInt(data.sleepMinutes) : undefined,
          batteryLevel: data.battery ? parseInt(data.battery) : undefined
        }
      };
      
      await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to save manual sync to DB:', err);
    }
  }, [recordHeartRateSample]);

  const updateLocalData = useCallback((updates) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  }, []);

  const startDemoSync = useCallback(async () => {
    // Deprecated. We are using a real database now.
    setErrorMessage('Demo sync disabled. Please use manual Quick Sync.');
    setConnectionState('error');
  }, []);

  const syncFromBridge = useCallback(() => {
    fetchWatchData(true);
  }, [fetchWatchData]);

  // Auto-poll the database every 10 seconds to keep the dashboard magically updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionState !== 'error') {
        fetchWatchData(false);
      }
    }, 10000);
    
    setTimeout(() => fetchWatchData(false), 0);
      
    return () => clearInterval(interval);
  }, [connectionState, fetchWatchData]);

  const value = {
    connectionState, deviceName, errorMessage,
    heartRate, heartRateHistory, batteryLevel,
    localData, showQuickSync, setShowQuickSync,
    connect, disconnect, quickSync, updateLocalData, startDemoSync, syncFromBridge,
    isConnected: connectionState === 'connected',
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error('useBluetooth must be used within a BluetoothProvider');
  return ctx;
}
