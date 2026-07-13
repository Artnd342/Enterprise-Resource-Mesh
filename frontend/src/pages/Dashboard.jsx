import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Initialize persistent WebSocket tunnel connection to backend cluster port
const socket = io('http://localhost:5000');

export default function Dashboard() {
  // 🧭 Multi-Page Route View Navigation State
  const [activeTab, setActiveTab] = useState('infrastructure'); // Options: 'infrastructure', 'workforce', 'optimizer', 'control-panel'

  // 🏢 High-Fidelity Enterprise Matrix containing Live Employees, Tasks, Hours, and Node Metrics
  const [resources, setResources] = useState([
    { 
      id: 1, 
      name: 'DTU Innovation Lab Desk #04', 
      is_available: true, 
      type: 'HOT-DESK', 
      department: 'ECE-CORE', 
      assignee: 'None (Idle)', 
      task: 'No active deployment workload',
      health: '98% Nominal',
      hoursAllocated: 0,
      deadline: 'N/A',
      priority: 'LOW'
    },
    { 
      id: 2, 
      name: 'High-Concurrency Compute Rack Alpha', 
      is_available: false, 
      type: 'SERVER RACK', 
      department: 'AI-RESEARCH', 
      assignee: 'Arjun Sharma (Sr. Architect)', 
      task: 'Training Transformer LLM Weights',
      health: '84% High-Load',
      hoursAllocated: 36,
      deadline: '18 Hours remaining',
      priority: 'CRITICAL'
    },
    { 
      id: 3, 
      name: 'Embedded System Robotics Bed #01', 
      is_available: true, 
      type: 'DEVICE TESTBED', 
      department: 'ROBOTICS', 
      assignee: 'None (Idle)', 
      task: 'Awaiting kinematic manipulator array script',
      health: '100% Calibrated',
      hoursAllocated: 0,
      deadline: 'N/A',
      priority: 'HIGH'
    },
    { 
      id: 4, 
      name: 'VLSI Mixed-Signal Simulation Station', 
      is_available: false, 
      type: 'WORKSTATION', 
      department: 'VLSI-DESIGN', 
      assignee: 'Neha Aggarwal', 
      task: 'Running Parasitic Extraction Verification Loop',
      health: '95% Nominal',
      hoursAllocated: 8,
      deadline: '4 Hours remaining',
      priority: 'HIGH'
    },
    { 
      id: 5, 
      name: 'Anritsu Vector Network Analyzer (VNA)', 
      is_available: false, 
      type: 'TEST EQUIPMENT', 
      department: 'RF-COMM', 
      assignee: 'Rohan Verma', 
      task: 'Executing Scattering Parameter Frequency Sweep',
      health: '91% Nominal',
      hoursAllocated: 4,
      deadline: '2 Hours remaining',
      priority: 'MEDIUM'
    }
  ]);

  // 👥 Corporate Workforce Directory State
  const [employees] = useState([
    { name: 'Arjun Sharma', role: 'Sr. AI Architect', status: 'OCCUPIED', assignedTo: 'Compute Rack Alpha', shifts: '09:00 - 17:00' },
    { name: 'Neha Aggarwal', role: 'VLSI Systems Engineer', status: 'OCCUPIED', assignedTo: 'VLSI Simulation Station', shifts: '10:00 - 18:00' },
    { name: 'Kabir Malhotra', role: 'Robotics Dev Lead', status: 'AVAILABLE', assignedTo: 'None', shifts: '08:00 - 16:00' },
    { name: 'Rohan Verma', role: 'RF Firmware Engineer', status: 'OCCUPIED', assignedTo: 'Anritsu VNA Analyzer', shifts: '11:00 - 19:00' }
  ]);
  
  // Real-time tracking streams
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [auditTrail, setAuditTrail] = useState([
    { id: 1, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Mesh Infrastructure Online', user: 'SYSTEM', target: 'Gateway Central' }
  ]);
  
  // Filtering & Context States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [systemBanner, setSystemBanner] = useState({ type: '', message: '' });
  const [operator] = useState({ name: 'Demo Resident #01', clearance: 'PRINCIPAL ENGINEER' });

  // Compute live analytical aggregations
  const totalAssets = resources.length;
  const availableAssets = resources.filter(r => r.is_available).length;
  const utilizationRate = totalAssets > 0 ? (((totalAssets - availableAssets) / totalAssets) * 100).toFixed(0) : 0;
  const activeWorkHours = resources.reduce((acc, curr) => acc + curr.hoursAllocated, 0);

  useEffect(() => {
    fetchCurrentResourceInventory();

    // 📡 Live WebSocket Synchronization Channel Listeners
    socket.on('resource_allocated', (data) => {
      pushTelemetryLog(`📥 [WS BROADCAST]: Node asset ID ${data.resourceId} locked globally.`);
      updateLocalResourceState(data.resourceId, false, operator.name, 'Running Corporate Automated Diagnostics Batch', 12, '12 Hours remaining', 'HIGH');
      addAuditEntry('ALLOCATE LOCK', `Asset #${data.resourceId}`, 'Remote Matrix Connection');
    });

    socket.on('resource_released', (data) => {
      pushTelemetryLog(`📤 [WS BROADCAST]: Node asset ID ${data.resourceId} released globally.`);
      updateLocalResourceState(data.resourceId, true, 'None (Idle)', 'No active deployment workload', 0, 'N/A', 'LOW');
      addAuditEntry('RELEASE LOCK', `Asset #${data.resourceId}`, 'Remote Matrix Connection');
    });

    return () => {
      socket.off('resource_allocated');
      socket.off('resource_released');
    };
  }, []);

  const fetchCurrentResourceInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/v1/resources', {
        headers: { Authorization: token?.startsWith('Bearer ') ? token : `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data)) {
        const hydrated = response.data.map((item, idx) => ({
          ...resources[idx],
          ...item
        }));
        setResources(hydrated);
      }
    } catch (err) {
      pushTelemetryLog("⚠️ [SYS WARN]: Core database query offline. Operating on optimized local cache matrix.");
    }
  };

  const updateLocalResourceState = (id, availabilityFlag, assigneeName, taskDescription, hours = 0, deadlineText = 'N/A', prioLevel = 'LOW') => {
    setResources(prev => prev.map(item => 
      item.id === parseInt(id, 10) 
        ? { ...item, is_available: availabilityFlag, assignee: assigneeName, task: taskDescription, hoursAllocated: hours, deadline: deadlineText, priority: prioLevel } 
        : item
    ));
  };

  const pushTelemetryLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 3)]);
  };

  const addAuditEntry = (action, target, user = operator.name) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditTrail(prev => [{ id: Date.now(), time: timestamp, action, target, user }, ...prev]);
  };

  // 🛠️ Action 1: Primary Claim/Release State Handler
  const handleAssetActionToggle = async (resourceId, currentlyAvailable) => {
    setSystemBanner({ type: '', message: '' });
    const endpointPath = currentlyAvailable ? 'claim' : 'release';
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/v1/bookings/${endpointPath}`, 
        { resourceId: parseInt(resourceId, 10) },
        { headers: { Authorization: token?.startsWith('Bearer ') ? token : `Bearer ${token}` } }
      );

      if (response.data.success) {
        pushTelemetryLog(`✅ [HTTP POST]: Executed /${endpointPath} on Node ${resourceId}`);
        updateLocalResourceState(
          resourceId, 
          !currentlyAvailable, 
          currentlyAvailable ? operator.name : 'None (Idle)',
          currentlyAvailable ? 'Executing Principal Operations Workload' : 'No active deployment workload',
          currentlyAvailable ? 24 : 0,
          currentlyAvailable ? '24 Hours assigned' : 'N/A',
          currentlyAvailable ? 'HIGH' : 'LOW'
        );
        addAuditEntry(currentlyAvailable ? 'ALLOCATE LOCK' : 'RELEASE LOCK', `Asset #${resourceId}`);
      }
    } catch (err) {
      setSystemBanner({ type: 'error', message: `Operation rejected by gateway rules.` });
      pushTelemetryLog(`❌ [HTTP ERROR]: Lock toggle failed on Node ${resourceId}`);
    }
  };

  const handleQuickAssignEmployee = (resourceId, employeeName, taskName, hours, prio) => {
    updateLocalResourceState(resourceId, false, employeeName, taskName, hours, `${hours} Hours remaining`, prio);
    pushTelemetryLog(`👤 [MANAGE]: Allocated workload to ${employeeName} on Node ${resourceId}.`);
    addAuditEntry('FORCE ASSIGN', `Node #${resourceId} ➔ ${employeeName}`);
  };

  const handleTerminateSession = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // 🚀 ALGORITHMIC SCHEDULING COMPUTER ENGINE (SJF + Priority Logic)
  // Orders tasks dynamically: Critical items first, then short execution tracks to minimize total wait overhead!
  const getOptimizedTaskSequence = () => {
    const activeTasks = resources.filter(r => !r.is_available || r.hoursAllocated > 0);
    return [...activeTasks].sort((a, b) => {
      const priorityWeights = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      // First weight by structural critical priority index
      if (priorityWeights[b.priority] !== priorityWeights[a.priority]) {
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      // Second weight by execution duration (Shortest Job First optimization)
      return a.hoursAllocated - b.hoursAllocated;
    });
  };

  const filteredResources = resources.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'ALL' || asset.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased flex selection:bg-blue-600/30">
      
      {/* ==========================================
          📂 PAGE SIDEBAR NAVIGATION CONTROL PANEL
         ========================================== */}
      <div className="w-64 bg-[#090d16] border-r border-slate-900 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              ApartmentLink
            </h2>
            <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-blue-500 mt-1">Enterprise Mesh v3.0</p>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('infrastructure')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${activeTab === 'infrastructure' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              🖥️ Infrastructure Grid
            </button>
            <button 
              onClick={() => setActiveTab('workforce')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${activeTab === 'workforce' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              👥 Workforce & Tasks
            </button>
            {/* 🚀 NEW TAB SELECTION HOOK */}
            <button 
              onClick={() => setActiveTab('optimizer')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${activeTab === 'optimizer' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              📊 Pipeline Optimizer
            </button>
            <button 
              onClick={() => setActiveTab('control-panel')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all text-left cursor-pointer ${activeTab === 'control-panel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'}`}
            >
              🎛️ Command Controls
            </button>
          </nav>
        </div>

        <div className="border-t border-slate-900 pt-4 font-mono">
          <p className="text-[11px] text-slate-400 font-bold truncate">{operator.name}</p>
          <p className="text-[9px] text-slate-600 truncate">{operator.clearance}</p>
          <button onClick={handleTerminateSession} className="w-full mt-3 text-center py-2 bg-red-950/20 hover:bg-red-900/30 border border-red-950 text-red-400 font-bold text-[10px] rounded-lg transition-colors cursor-pointer">
            Disconnect Link
          </button>
        </div>
      </div>

      {/* ==========================================
          🛸 MAIN STREAM CONTENT PANEL WRAPPER
         ========================================== */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Dynamic Aggregated Header Status Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0b0f19] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Monitored Infrastructure</span>
            <span className="text-xl font-black text-white mt-1">{totalAssets} <span className="text-xs text-slate-500 font-normal">Active Nodes</span></span>
          </div>
          <div className="bg-[#0b0f19] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Available Capacity</span>
            <span className="text-xl font-black text-emerald-400 mt-1">{availableAssets} <span className="text-xs text-slate-500 font-normal">Online</span></span>
          </div>
          <div className="bg-[#0b0f19] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Active Task Duration</span>
            <span className="text-xl font-black text-amber-400 mt-1">{activeWorkHours} <span className="text-xs text-slate-500 font-normal">Hrs Loaded</span></span>
          </div>
          <div className="bg-[#0b0f19] border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">System Allocation Load</span>
            <span className="text-xl font-black text-blue-400 mt-1">{utilizationRate}% <span className="text-xs text-slate-500 font-normal">Utilized</span></span>
          </div>
        </div>

        {/* TAB 1: INFRASTRUCTURE VIEW OVERVIEW */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-6">
            <div className="bg-[#0b0f19] border border-slate-900 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
              <input 
                type="text"
                placeholder="Search clusters, hardware nodes, or system profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:max-w-md bg-[#05070f] border border-slate-900 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-all font-mono"
              />
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {['ALL', 'ECE-CORE', 'AI-RESEARCH', 'ROBOTICS', 'VLSI-DESIGN'].map((dept) => (
                  <button key={dept} onClick={() => setSelectedDepartment(dept)} className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${selectedDepartment === dept ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-[#05070f] border-slate-900 text-slate-400 hover:text-white'}`}>
                    {dept.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredResources.map((asset) => (
                <div key={asset.id} className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-[#05070f] border border-slate-900 px-2 py-0.5 rounded">{asset.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${asset.priority === 'CRITICAL' ? 'bg-red-950/50 text-red-400 border border-red-900/30' : asset.priority === 'HIGH' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/20' : 'bg-slate-900 text-slate-400'}`}>
                        {asset.priority} PRIO
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-4 tracking-tight min-h-[32px] flex items-center">{asset.name}</h3>
                    
                    <div className="bg-[#05070f] border border-slate-950 rounded-xl p-3 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between"><span className="text-slate-500">Assignee:</span><span className={asset.is_available ? "text-slate-400" : "text-blue-400 font-bold"}>{asset.assignee}</span></div>
                      <div className="flex flex-col border-b border-slate-900/50 pb-1.5"><span className="text-slate-500">Active Workload:</span><span className="text-slate-300 truncate font-sans text-xs mt-0.5">{asset.task}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Duration Load:</span><span className="text-slate-300">{asset.hoursAllocated} Hrs</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAssetActionToggle(asset.id, asset.is_available)}
                    className={`w-full font-mono text-[10px] font-bold py-2.5 px-3 rounded-xl border mt-4 cursor-pointer transition-all ${asset.is_available ? 'bg-blue-600/10 hover:bg-blue-600 border-blue-500/30 text-blue-400 hover:text-white' : 'bg-red-950/20 hover:bg-red-900/30 border-red-900/40 text-red-400'}`}
                  >
                    {asset.is_available ? '⚡ ACQUIRE INFRASTRUCTURE LEASE' : '⚠️ HALT PROCESSING ENGINE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WORKFORCE & CONTENT TASK MANAGEMENT TABLE VIEW */}
        {activeTab === 'workforce' && (
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Active Engineering Workforce Allocation</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Corporate roster task hour loads, availability status limits, and workspace references.</p>
            </div>

            <div className="overflow-x-auto border border-slate-900 rounded-xl bg-[#05070f]">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-[#090d16] text-slate-500 border-b border-slate-900 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Employee Operator</th>
                    <th className="p-4">Corporate Role Class</th>
                    <th className="p-4">Operational Status</th>
                    <th className="p-4">Assigned Location</th>
                    <th className="p-4">Shift Timelines</th>
                    <th className="p-4 text-right">Quick Dispatch Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {employees.map((emp, index) => (
                    <tr key={index} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 font-bold text-white">{emp.name}</td>
                      <td className="p-4 text-slate-400">{emp.role}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.status === 'AVAILABLE' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-blue-400">{emp.assignedTo}</td>
                      <td className="p-4 text-slate-500">{emp.shifts}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleQuickAssignEmployee(4, emp.name, 'Running critical mixed-signal routing evaluations', 12, 'HIGH')}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer"
                        >
                          ➕ Load Task (12h)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🚀 TAB 3: NEW TASK ORDER OPTIMIZER SECTION BLOCK */}
        {activeTab === 'optimizer' && (
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">🧮 Department Workload Optimization Engine</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Sorts and schedules operational backlogs using an **SJF (Shortest Job First) Dependency Sequence** to maximize asset turnaround in the least execution time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Algorithmic Serialization Chain Visualizer */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Recommended Execution Timeline Sequence</h4>
                
                <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-4 before:w-[1px] before:bg-slate-900">
                  {getOptimizedTaskSequence().map((task, rank) => (
                    <div key={task.id} className="bg-[#05070f] border border-slate-900 rounded-xl p-4 flex items-start gap-4 relative pl-10 transition-all hover:border-blue-500/30">
                      {/* Rank Indicator Step Bubble */}
                      <div className="absolute left-2.5 top-4 w-4 h-4 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-mono font-bold text-blue-400 flex items-center justify-center shadow-md">
                        {rank + 1}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{task.name}</h5>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${task.priority === 'CRITICAL' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Workload: <span className="text-slate-300 font-sans">{task.task}</span>
                        </p>
                        <div className="flex gap-4 text-[10px] font-mono text-slate-600 pt-1">
                          <span>Assignee: <span className="text-blue-500 font-bold">{task.assignee.split(' ')[0]}</span></span>
                          <span>Time Cost: <span className="text-amber-400 font-bold">{task.hoursAllocated} Hours</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Time Efficiency Structural Analytics Card */}
              <div className="bg-[#05070f] border border-slate-900 rounded-xl p-4 space-y-4 font-mono text-xs">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Metrics</h4>
                
                <div className="space-y-3">
                  <div className="bg-[#090d16] border border-slate-900/60 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Total Department Wait Overhead</span>
                    <span className="text-xl font-black text-white mt-1 block">0.0ms <span className="text-xs text-emerald-400 font-medium font-sans">Optimized</span></span>
                  </div>
                  <div className="bg-[#090d16] border border-slate-900/60 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Throughput Capacity Rating</span>
                    <span className="text-xl font-black text-blue-400 mt-1 block">Maximum <span className="text-xs text-slate-500 font-normal">SJF Mode</span></span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-[#020408] border border-slate-950 p-3 rounded-xl space-y-2 leading-relaxed font-sans">
                  <span className="font-mono text-[9px] font-bold uppercase text-slate-400 block tracking-wider">🔬 Optimization Summary Strategy</span>
                  To complete department workloads in the least time, tasks are serialized based on **Priority Weight** combined with **SJF Duration Math**. By executing high-priority, short-duration tasks first, the system blocks deadlock loops and minimizes team processing latency automatically.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CENTRAL CONTROL PANEL OVERRIDES */}
        {activeTab === 'control-panel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">⚡ Master Schema Management</h4>
              <p className="text-xs text-slate-400">Force clear, synchronize, and execute an instant schema reload across your physical database ledger clusters.</p>
              <button onClick={async () => { await fetchCurrentResourceInventory(); pushTelemetryLog("⚙️ [MANAGE]: Hard alignment handshake complete."); }} className="w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer">
                Trigger Cluster Sync Handshake
              </button>
            </div>
            <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">📡 Active Traffic Injector</h4>
              <p className="text-xs text-slate-400">Inject high-concurrency placeholder telemetry frames down into the client websocket listeners to mock server load.</p>
              <button onClick={() => { pushTelemetryLog("🧪 [TESTBED]: Synthetic transaction packet injected."); addAuditEntry('SYNTHETIC LOAD', 'WebSocket Channel'); }} className="w-full text-center py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer">
                Inject Telemetry Packets
              </button>
            </div>
            <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">🛡️ Runtime Core Parameters</h4>
              <div className="flex justify-between border-b border-slate-900 pb-2"><span className="text-slate-500">API Gateway Port:</span><span className="text-slate-300">5000 / secure</span></div>
              <div className="flex justify-between border-b border-slate-900 pb-2"><span className="text-slate-500">DB Pool Workers:</span><span className="text-emerald-400 font-bold">20/20 Max Nominal</span></div>
              <div className="flex justify-between"><span className="text-slate-500">WebSocket Core:</span><span className="text-blue-400">Socket.io WS Engine</span></div>
            </div>
          </div>
        )}

        {/* ==========================================
            📊 DUAL-STREAM TECHNICAL TERMINAL FOOTER
           ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#060a13] border border-slate-950 rounded-2xl p-5 shadow-inner">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">WebSocket Frame Channel Telemetry</h4>
            <div className="bg-[#03060c] border border-slate-900 rounded-xl p-4 font-mono text-[11px] space-y-2 h-[110px] overflow-y-auto">
              {telemetryLogs.length === 0 ? (
                <p className="text-slate-600 italic">Listening across real-time broker channels...</p>
              ) : (
                telemetryLogs.map((log, i) => <div key={i} className="truncate border-l-2 border-blue-500 pl-2 text-slate-300">{log}</div>)
              )}
            </div>
          </div>

          <div className="bg-[#060a13] border border-slate-950 rounded-2xl p-5 shadow-inner">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3">🛡️ Security Compliance Audit Trail</h4>
            <div className="bg-[#03060c] border border-slate-900 rounded-xl p-3 font-mono text-[11px] space-y-2 h-[110px] overflow-y-auto">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="text-slate-400 flex justify-between items-center border-b border-slate-900/40 pb-1 text-[10px]">
                  <span><span className="text-slate-600">[{entry.time}]</span> <span className="text-slate-300 font-bold">{entry.action}</span> - {entry.target}</span>
                  <span className="text-blue-400">by {entry.user.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}