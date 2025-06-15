'use client';

import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { getAnnouncementList } from '@/shared/api/common';
import { format, parseISO } from 'date-fns';
import { IAnnouncementResponse } from '@/shared/api/common';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/shared/stores/useAuthStore';

function NoticeDashBoard() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<IAnnouncementResponse[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const username = useAuthStore(state => state.username);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!username) {
      setShowModal(true);
    }
  }, [username]);

  const handleModalConfirm = () => {
    setShowModal(false);
    router.push('/signin');
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncementList({
        page,
        size: rowsPerPage
      });

      if (response.data) {
        setAnnouncements(response.data.data.content);
        setTotalCount(response.data.data.totalElements);
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('로그인이 필요합니다.');
        router.push('/signin');
      } else {
        toast.error('공지사항을 불러오는데 실패했습니다.');
      }
      console.error('공지사항을 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, rowsPerPage]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const columns = [
    {
      id: 'topExposureTag',
      label: '태그',
      width: '15%',
      align: 'left' as const
    },
    { id: 'title', label: '제목', width: '50%', align: 'left' as const },
    { id: 'views', label: '조회수', width: '10%', align: 'center' as const },
    { id: 'updatedAt', label: '수정일', width: '25%', align: 'center' as const }
  ];

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('날짜 형식 오류:', error);
      return '날짜 오류';
    }
  };

  const renderRow = (row: IAnnouncementResponse) => (
    <TableRow
      key={row.announcementId}
      hover
      onClick={() => router.push(`/notice/dashboard/${row.announcementId}`)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ width: '15%' }}>
        {row.topExposureTag && (
          <Badge
            variant="secondary"
            className="ml-2"
            style={{
              backgroundColor: colors.brand[500],
              color: 'white'
            }}
          >
            {row.topExposureTag}
          </Badge>
        )}
      </TableCell>
      <TableCell sx={{ width: '50%' }}>{row.title}</TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        {row.views}
      </TableCell>
      <TableCell align="center" sx={{ width: '25%' }}>
        {formatDate(row.updatedAt)}
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      <div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 600,
            color: colors.gray_scale[900],
            paddingBottom: '40px'
          }}
        >
          공지사항
        </h1>
      </div>
      <div>
        <DashBoard<IAnnouncementResponse>
          rows={announcements}
          columns={columns}
          renderRow={renderRow}
          rowsPerPage={rowsPerPage}
          page={page}
          totalCount={totalCount}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>로그인이 필요합니다</h3>
            <p style={{ marginBottom: '20px' }}>
              해당 기능을 이용하기 위해서는 로그인이 필요합니다.
            </p>
            <button
              onClick={handleModalConfirm}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeDashBoard;
