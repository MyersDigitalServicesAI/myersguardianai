import { useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { generateLiveTask } from '../services/mockData';

export const useSystemSimulation = () => {
  const { killSwitch, addTask, updateStats } = useAppStore();

  useEffect(() => {
    if (killSwitch) return;

    // Simulate backend stats stream
    const statsInterval = setInterval(() => {
      updateStats({
        totalRuns: useAppStore.getState().stats.totalRuns + Math.floor(Math.random() * 2),
        moneySaved: useAppStore.getState().stats.moneySaved + (Math.random() > 0.7 ? 15 : 0)
      });
    }, 3000);

    // Simulate incoming tasks via WebSocket
    const taskInterval = setInterval(() => {
      // 40% chance to add a new task every 4 seconds to the queue
      if (Math.random() > 0.6) {
        const newTask = generateLiveTask();
        addTask(newTask);
        
        if (newTask.riskFlag) {
            updateStats({
                risksCaught: useAppStore.getState().stats.risksCaught + 1
            });
        }
      }
    }, 4000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(taskInterval);
    };
  }, [killSwitch, addTask, updateStats]);
};