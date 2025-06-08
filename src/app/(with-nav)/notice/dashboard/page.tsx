'use client';

import { colors } from '@/design-tokens';
import { DashBoard } from '@/shared';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { getAnnouncementList } from '@/shared/api/common';
import { format, parseISO } from 'date-fns';
import { IAnnouncementResponse } from '@/shared/api/common';
import { ApiResponse, PaginatedResponse } from '@/shared/type';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

function NoticeDashBoard() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<IAnnouncementResponse[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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
    } catch (error) {
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
    { id: 'title', label: '제목', width: '50%', align: 'left' as const },
    {
      id: 'topExposureTag',
      label: '태그',
      width: '15%',
      align: 'left' as const
    },
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
      <TableCell sx={{ width: '50%' }}>{row.title}</TableCell>
      <TableCell sx={{ width: '15%' }}>
        {row.topExposureTag && (
          <Badge variant="secondary" className="ml-2">
            {row.topExposureTag}
          </Badge>
        )}
      </TableCell>
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
    </div>
  );
}

export default NoticeDashBoard;
