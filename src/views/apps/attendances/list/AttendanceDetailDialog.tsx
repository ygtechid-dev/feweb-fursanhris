import React, { useState } from 'react';

import Image from 'next/image';
import axios from 'axios';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Typography } from '@mui/material';
import axiosInstance from '@/libs/axios';

interface AttendanceDetailProps {
  id: number;
  date: string;
  employee_id: number;
  employee_name: string;
  status: string;
  clock_in: string;
  clock_in_formatted: string;
  clock_in_location: string;
  clock_in_latitude: string;
  clock_in_longitude: string;
  clock_in_photo: string;
  clock_in_notes: string;
  clock_out: string | null;
  clock_out_formatted: string | null;
  clock_out_location: string | null;
  clock_out_latitude: string | null;
  clock_out_longitude: string | null;
  clock_out_photo: string | null;
  clock_out_notes: string | null;
  late: string;
  early_leaving: string;
  overtime: string;
  total_rest: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface AttendanceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  attendanceId: number | null;
  dictionary: any;
}

const AttendanceDetailDialog = ({ open, onClose, attendanceId, dictionary }: AttendanceDetailDialogProps) => {
  const [attendanceDetail, setAttendanceDetail] = useState<AttendanceDetailProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchAttendanceDetail = async () => {
      if (!attendanceId || !open) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance.get(`/web/attendance-employee/${attendanceId}`);
        console.log({response})
        setAttendanceDetail(response.data?.data);
      } catch (err) {
        console.error('Error fetching attendance details:', err);
        setError(dictionary['errors']?.fetchFailed || 'Failed to fetch attendance details');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetail();
  }, [attendanceId, open]);

  const handleClose = () => {
    setAttendanceDetail(null);
    onClose();
  };

  // Fungsi untuk membuka foto di tab baru
  const openPhotoInNewTab = (photoUrl: string) => {
    window.open(photoUrl, '_blank');
  };

  const renderLocationSection = (title: string, location: string | null, latitude: string | null, longitude: string | null) => {
    if (!location) return null;
    
    return (
      <div className="mb-6">
        <Typography className="font-medium mb-2">{title}</Typography>
        <Card>
          <CardContent className="">
            <Typography className="mb-2">{location}</Typography>
            {latitude && longitude && (
              <Typography variant="body2" color="text.secondary">
                Lat: {latitude}, Long: {longitude}
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPhotoSection = (title: string, photoUrl: string | null, notes: string | null) => {
    if (!photoUrl) return null;
    
    return (
      <div className="mb-6">
        <Typography className="font-medium mb-2">{title}</Typography>
        <Card>
          <CardContent className="p-4">
            <div 
              className="relative h-64 w-full mb-2 bg-gray-100 rounded overflow-hidden cursor-pointer"
              onClick={() => photoUrl && openPhotoInNewTab(photoUrl)}
              title={dictionary['actions']?.clickToViewFull || 'Click to view full image'}
            >
              <Image 
                src={photoUrl} 
                alt={title}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <Typography 
                  className="text-white opacity-0 hover:opacity-100 transition-opacity p-2 bg-black bg-opacity-50 rounded"
                >
                  {dictionary['actions']?.clickToViewFull || 'Click to view full image'}
                </Typography>
              </div>
            </div>
            {notes && (
              <Typography variant="body2" className="mt-2">
                {notes}
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTimingDetails = () => {
    if (!attendanceDetail) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: dictionary['content']?.late || 'Late', value: attendanceDetail.late },
          { label: dictionary['content']?.earlyLeaving || 'Early Leaving', value: attendanceDetail.early_leaving },
          { label: dictionary['content']?.overtime || 'Overtime', value: attendanceDetail.overtime },
          { label: dictionary['content']?.totalRest || 'Total Rest', value: attendanceDetail.total_rest }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography className="font-medium">{item.value || '00:00:00'}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        scroll='body'
        maxWidth={`sm`}
        >
      <DialogContent className="">
          <DialogTitle className='text-center p-1 pt-2 pb-4'>
            {dictionary['content']?.attendanceDetails || 'Attendance Details'}
          </DialogTitle>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {error && (
          <div className="py-4 text-center">
            <Typography color="error">{error}</Typography>
            <Button variant="outlined" onClick={handleClose} className="mt-4">
              {dictionary['actions']?.close || 'Close'}
            </Button>
          </div>
        )}

        {!loading && !error && attendanceDetail && (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.employee || 'Employee'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.employee_name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.date || 'Date'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.date}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.status || 'Status'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.status}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.timezone || 'Timezone'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.timezone}
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.clockIn || 'Clock In'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.clock_in_formatted || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary['content']?.clockOut || 'Clock Out'}
                  </Typography>
                  <Typography className="font-medium">
                    {attendanceDetail.clock_out_formatted || '-'}
                  </Typography>
                </div>
              </div>

              {renderTimingDetails()}

              {renderLocationSection(
                dictionary['content']?.clockInLocation || 'Clock In Location', 
                attendanceDetail.clock_in_location,
                attendanceDetail.clock_in_latitude,
                attendanceDetail.clock_in_longitude
              )}

              {renderLocationSection(
                dictionary['content']?.clockOutLocation || 'Clock Out Location', 
                attendanceDetail.clock_out_location,
                attendanceDetail.clock_out_latitude,
                attendanceDetail.clock_out_longitude
              )}

              {renderPhotoSection(
                dictionary['content']?.clockInPhoto || 'Clock In Photo', 
                attendanceDetail.clock_in_photo,
                attendanceDetail.clock_in_notes
              )}

              {renderPhotoSection(
                dictionary['content']?.clockOutPhoto || 'Clock Out Photo', 
                attendanceDetail.clock_out_photo,
                attendanceDetail.clock_out_notes
              )}
            </div>

            <DialogActions className='px-2 pt-4 pb-2'>
              <Button onClick={handleClose}>
                {dictionary['actions']?.close || 'Close'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDetailDialog;
