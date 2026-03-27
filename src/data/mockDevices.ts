export type DeviceProtocol = 'WiFi' | 'Zigbee' | 'Bluetooth' | 'Thread' | 'MQTT';
export type DeviceCategory = 'lighting' | 'sensor' | 'switch' | 'camera' | 'thermostat' | 'plug';
export type DeviceStatus = 'online' | 'offline' | 'idle';

export interface Device {
  id: string;
  name: string;
  hardwareId: string;
  protocol: DeviceProtocol;
  category: DeviceCategory;
  room: string;
  status: DeviceStatus;
  lastSeen: string;
  rssi: number;
  battery?: number;
  firmware: string;
  ip?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  action: string;
  lastTriggered?: string;
}

export const mockDevices: Device[] = [
  { id: '1', name: 'Lâmpada Sala', hardwareId: 'ESP32-A1B2C3', protocol: 'WiFi', category: 'lighting', room: 'Sala', status: 'online', lastSeen: '2026-03-27T14:32:00Z', rssi: -45, firmware: '2.1.3', ip: '192.168.1.101' },
  { id: '2', name: 'Sensor Temperatura', hardwareId: 'ZB-TEMP-001', protocol: 'Zigbee', category: 'sensor', room: 'Quarto', status: 'online', lastSeen: '2026-03-27T14:31:50Z', rssi: -62, battery: 78, firmware: '1.4.0' },
  { id: '3', name: 'Tomada Inteligente', hardwareId: 'PLUG-X9F2', protocol: 'WiFi', category: 'plug', room: 'Cozinha', status: 'offline', lastSeen: '2026-03-27T10:15:00Z', rssi: -80, firmware: '1.2.1', ip: '192.168.1.115' },
  { id: '4', name: 'Câmera Garagem', hardwareId: 'CAM-RT-003', protocol: 'WiFi', category: 'camera', room: 'Garagem', status: 'online', lastSeen: '2026-03-27T14:32:05Z', rssi: -55, firmware: '3.0.1', ip: '192.168.1.120' },
  { id: '5', name: 'Sensor Porta', hardwareId: 'ZB-DOOR-007', protocol: 'Zigbee', category: 'sensor', room: 'Entrada', status: 'online', lastSeen: '2026-03-27T14:30:00Z', rssi: -70, battery: 42, firmware: '1.1.0' },
  { id: '6', name: 'Termostato AC', hardwareId: 'BLE-THERM-02', protocol: 'Bluetooth', category: 'thermostat', room: 'Quarto', status: 'idle', lastSeen: '2026-03-27T13:00:00Z', rssi: -50, firmware: '2.0.5' },
  { id: '7', name: 'Fita LED', hardwareId: 'ESP32-LED-99', protocol: 'MQTT', category: 'lighting', room: 'Escritório', status: 'online', lastSeen: '2026-03-27T14:32:10Z', rssi: -38, firmware: '1.8.2', ip: '192.168.1.130' },
  { id: '8', name: 'Sensor Umidade', hardwareId: 'THR-HUM-005', protocol: 'Thread', category: 'sensor', room: 'Banheiro', status: 'online', lastSeen: '2026-03-27T14:31:00Z', rssi: -58, battery: 15, firmware: '1.0.3' },
];

export const mockAutomations: AutomationRule[] = [
  { id: '1', name: 'Desligar luzes à noite', enabled: true, trigger: 'Horário = 23:00', action: 'Desligar Lâmpada Sala', lastTriggered: '2026-03-26T23:00:00Z' },
  { id: '2', name: 'Alerta temperatura alta', enabled: true, trigger: 'Sensor Temperatura > 30°C', action: 'Ligar Termostato AC', lastTriggered: '2026-03-27T12:15:00Z' },
  { id: '3', name: 'Iluminação ao entrar', enabled: false, trigger: 'Sensor Porta = aberto', action: 'Ligar Lâmpada Sala (50%)', lastTriggered: '2026-03-25T18:30:00Z' },
  { id: '4', name: 'Economia de energia', enabled: true, trigger: 'Tomada > 500W por 1h', action: 'Notificar + Desligar', lastTriggered: undefined },
];

export const mockLogs = [
  { ts: '14:32:10', level: 'info' as const, source: 'mqtt', msg: 'ESP32-LED-99 published to home/office/led/state: {"on":true,"brightness":80}' },
  { ts: '14:31:50', level: 'info' as const, source: 'zigbee', msg: 'ZB-TEMP-001 reported temperature: 24.5°C, humidity: 55%' },
  { ts: '14:30:05', level: 'warn' as const, source: 'system', msg: 'Device PLUG-X9F2 missed 3 heartbeats — marking offline' },
  { ts: '14:30:00', level: 'info' as const, source: 'zigbee', msg: 'ZB-DOOR-007 state change: closed → open' },
  { ts: '14:28:00', level: 'error' as const, source: 'ota', msg: 'Firmware update failed for BLE-THERM-02: timeout after 30s' },
  { ts: '14:25:12', level: 'info' as const, source: 'mqtt', msg: 'New subscription: home/kitchen/plug/power' },
  { ts: '14:20:00', level: 'info' as const, source: 'discovery', msg: 'mDNS scan completed: 0 new devices found' },
  { ts: '14:15:33', level: 'warn' as const, source: 'battery', msg: 'THR-HUM-005 battery at 15% — below threshold' },
];
