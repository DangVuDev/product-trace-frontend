// src/components/Timeline.tsx
// src/components/Timeline.tsx

import { Box, Truck, CheckCircle, Package, Clock, MapPin } from 'lucide-react';
import type { StatusHistory } from '../types';

interface TimelineProps {
  history: StatusHistory[];
}

const getIcon = (status: string) => {
  if (status.toLowerCase().includes('đóng gói') || status.toLowerCase().includes('gói')) 
    return <Box className="w-5 h-5 text-white" />;
  if (status.toLowerCase().includes('vận chuyển') || status.toLowerCase().includes('chuyển')) 
    return <Truck className="w-5 h-5 text-white" />;
  if (status.toLowerCase().includes('giao')) 
    return <Package className="w-5 h-5 text-white" />;
  return <CheckCircle className="w-5 h-5 text-white" />;
};

export default function Timeline({ history }: TimelineProps) {
  // Không reverse → giữ thứ tự từ cũ → mới
  // Mới nhất = phần tử cuối → index === history.length - 1
  const items = [...history]; // Clone để an toàn

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Chưa có lịch sử</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Đường thẳng dọc */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {items.map((item, index) => {
          const isLatest = index === items.length - 1;
          const isFirst = index === 0;

          // Chuyển ISO string → Date object
          const date = new Date(item.timestamp);
          const isValidDate = !isNaN(date.getTime());

          return (
            <div key={index} className="relative flex gap-4">
              {/* Điểm mốc */}
              <div
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ring-8 transition-all ${
                  isLatest
                    ? 'bg-green-500 ring-green-200 scale-110 shadow-lg'
                    : isFirst
                    ? 'bg-gray-400 ring-gray-200'
                    : 'bg-indigo-500 ring-indigo-200'
                }`}
              >
                {getIcon(item.status)}
              </div>

              {/* Nội dung */}
              <div
                className={`flex-1 pb-6 rounded-lg p-5 border-l-4 transition-all ${
                  isLatest
                    ? 'bg-green-50 border-green-500 shadow-md'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h4
                    className={`font-bold text-lg ${
                      isLatest ? 'text-green-900' : 'text-gray-900'
                    }`}
                  >
                    {item.status}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    {isValidDate
                      ? date.toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Không xác định'}
                  </div>
                </div>

                <p
                  className={`text-sm ${
                    isLatest ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {item.details}
                </p>

                {item.location && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      isLatest ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}