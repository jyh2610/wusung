'use client';

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Modal,
  Switch,
  Radio,
  Tabs
} from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { useQuery } from '@tanstack/react-query';
import request from '@/shared/api/axiosInstance';
import { ApiResponse } from '@/shared/type';
import { IMemberDetail, IpList, PrintHistory } from '@/components/admin/tpye';
import {
  withdrawMember,
  restoreMember,
  changeSubscriptionEndDate,
  changePassword,
  getIpList,
  getPrintHistory,
  getManagerList
} from '@/components/admin/api';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);
dayjs.locale('ko');

interface MemberDetailProps {
  memberId: number;
}

const getMemberDetail = async (memberId: number) => {
  const response = await request<ApiResponse<IMemberDetail>>({
    method: 'GET',
    url: `/api/admin/member/${memberId}`
  });
  return response.data.data;
};

export const MemberDetail: React.FC<MemberDetailProps> = ({ memberId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [printHistoryPage, setPrintHistoryPage] = useState(1);
  const [printHistoryPageSize, setPrintHistoryPageSize] = useState(10);
  const [ipListPage, setIpListPage] = useState(1);
  const [ipListPageSize, setIpListPageSize] = useState(10);
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMemberDetail(memberId)
  });

  const { data: ipListData } = useQuery({
    queryKey: ['member-ip-list', memberId, ipListPage, ipListPageSize],
    queryFn: () =>
      getIpList(memberId, {
        page: ipListPage - 1,
        size: ipListPageSize
      }),
    placeholderData: previousData => previousData
  });

  const { data: printHistoryData } = useQuery({
    queryKey: [
      'member-print-history',
      memberId,
      printHistoryPage,
      printHistoryPageSize
    ],
    queryFn: () =>
      getPrintHistory(memberId, {
        page: printHistoryPage,
        size: printHistoryPageSize
      }),
    placeholderData: previousData => previousData
  });

  const { data: managerListData } = useQuery({
    queryKey: ['member-manager-list', memberId],
    queryFn: () => getManagerList(memberId),
    placeholderData: previousData => previousData
  });

  console.log('Print History Data:', printHistoryData);

  const handlePasswordSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);
      await changePassword({
        memberId,
        newPassword: values.password,
        confirmPassword: values.confirmPassword
      });
      message.success('비밀번호가 성공적으로 변경되었습니다.');
      setIsPasswordModalVisible(false);
      form.resetFields(['password', 'confirmPassword']);
    } catch (error) {
      message.error('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionSubmit = async (values: {
    subscriptionEndDate: string;
    isVip: boolean;
  }) => {
    try {
      setLoading(true);
      await changeSubscriptionEndDate({
        memberId,
        newEndDate: dayjs(values.subscriptionEndDate).format('YYYY-MM-DD'),
        isVip: values.isVip
      });
      message.success('구독 정보가 성공적으로 변경되었습니다.');
      setIsSubscriptionModalVisible(false);
      form.resetFields(['subscriptionEndDate', 'isVip']);
      refetch();
    } catch (error) {
      message.error('구독 정보 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      if (data?.isWithdrawn) {
        await restoreMember(memberId);
        message.success('회원이 성공적으로 복구되었습니다.');
      } else {
        await withdrawMember(memberId);
        message.success('회원이 성공적으로 탈퇴되었습니다.');
      }
      setIsWithdrawModalVisible(false);
      refetch();
    } catch (error) {
      message.error('회원 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintHistoryTableChange = (page: number, pageSize: number) => {
    setPrintHistoryPage(page);
    setPrintHistoryPageSize(pageSize);
  };

  const handleIpListTableChange = (page: number, pageSize: number) => {
    setIpListPage(page);
    setIpListPageSize(pageSize);
  };

  const handlePaymentHistoryClick = () => {
    router.push(`/admin/payment?memberId=${memberId}`);
  };

  const handleInquiryHistoryClick = () => {
    router.push(`/admin/inquiry?memberId=${memberId}`);
  };

  const handleSubscriptionModalOpen = () => {
    form.setFieldsValue({
      subscriptionEndDate: data?.subscriptionEndDate
        ? dayjs(data.subscriptionEndDate)
        : dayjs(),
      isVip: data?.isVip
    });
    setIsSubscriptionModalVisible(true);
  };

  const ipListColumns = [
    {
      header: '회원 ID',
      accessorKey: 'memberId'
    },
    {
      header: 'IP 주소',
      accessorKey: 'ipAddress'
    },
    {
      header: '작업 유형',
      accessorKey: 'operationType'
    },
    {
      header: '업데이트 시간',
      accessorKey: 'updatedAt'
    }
  ];

  const printHistoryColumns = [
    {
      header: '출력 ID',
      accessorKey: 'printId'
    },
    {
      header: '출력 일시',
      accessorKey: 'printDate',
      cell: ({ row }: any) => {
        const date = row?.original?.printDate;
        return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
    },
    {
      header: '출력 유형',
      accessorKey: 'printType'
    },
    {
      header: '출력 페이지 수',
      accessorKey: 'printCount'
    },
    {
      header: '접속 IP',
      accessorKey: 'accessIp'
    },
    {
      header: '회원 ID',
      accessorKey: 'memberId'
    }
  ];

  const managerColumns = [
    {
      header: '담당자 ID',
      accessorKey: 'managerId'
    },
    {
      header: '이름',
      accessorKey: 'name'
    },
    {
      header: '직급',
      accessorKey: 'jobGrade'
    },
    {
      header: '전화번호',
      accessorKey: 'phoneNumber'
    },
    {
      header: '이메일',
      accessorKey: 'email'
    },
    {
      header: '주소',
      accessorKey: 'address'
    },
    {
      header: '등록일',
      accessorKey: 'createdAt',
      cell: ({ row }: any) => {
        const date = row?.original?.createdAt;
        return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
    }
  ];

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!data) {
    return <div>회원 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <Card title="회원 상세 정보" className="mb-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg">
                <strong>아이디:</strong> {data.username}
              </p>
              <p className="text-lg">
                <strong>이름:</strong> {data.name}
              </p>
              <p className="text-lg">
                <strong>전화번호:</strong> {data.phoneNumber}
              </p>
              <p className="text-lg">
                <strong>이메일:</strong> {data.email}
              </p>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">비밀번호</span>
                <Button
                  type="primary"
                  onClick={() => setIsPasswordModalVisible(true)}
                >
                  비밀번호 변경
                </Button>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3">
                <Button type="primary" onClick={handlePaymentHistoryClick}>
                  결제정보 조회
                </Button>
                <Button type="primary" onClick={handleInquiryHistoryClick}>
                  문의내역 조회
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg">
                <strong>회원 유형:</strong> {data.userType}
              </p>
              <p className="text-lg">
                <strong>역할:</strong> {data.role}
              </p>
              <p className="text-lg">
                <strong>주소:</strong> {data.address}
              </p>
              <p className="text-lg">
                <strong>생년월일/설립일:</strong>{' '}
                {dayjs(data.birthOrEstablishmentDate).format('YYYY-MM-DD')}
              </p>
              <p className="text-lg">
                <strong>가입일:</strong>{' '}
                {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')}
              </p>
              <p className="text-lg">
                <strong>탈퇴 여부:</strong> {data.isWithdrawn ? '탈퇴' : '활성'}
              </p>
              {data.isWithdrawn && (
                <p className="text-lg">
                  <strong>탈퇴일:</strong>{' '}
                  {dayjs(data.withdrawAt).format('YYYY-MM-DD HH:mm')}
                </p>
              )}
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">구독 종료일</span>
                  {data.subscriptionEndDate && (
                    <span className="text-sm text-gray-500">
                      {dayjs(data.subscriptionEndDate).format('YYYY-MM-DD')}
                    </span>
                  )}
                </div>
                <Button type="primary" onClick={handleSubscriptionModalOpen}>
                  구독 종료일 변경
                </Button>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">회원 상태</span>
                <Button
                  type={data.isWithdrawn ? 'primary' : 'default'}
                  danger={!data.isWithdrawn}
                  onClick={() => setIsWithdrawModalVisible(true)}
                >
                  {data.isWithdrawn ? '회원 복구' : '회원 탈퇴'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs
        defaultActiveKey="manager-info"
        items={[
          {
            key: 'manager-info',
            label: '담당자 정보',
            children: (
              <Card title="담당자 정보" className="mb-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {managerColumns.map(column => (
                          <TableHead key={column.accessorKey}>
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!managerListData ? (
                        <TableRow>
                          <TableCell
                            colSpan={managerColumns.length}
                            className="text-center"
                          >
                            로딩 중...
                          </TableCell>
                        </TableRow>
                      ) : !managerListData ||
                        (Array.isArray(managerListData) &&
                          managerListData.length === 0) ? (
                        <TableRow>
                          <TableCell
                            colSpan={managerColumns.length}
                            className="text-center"
                          >
                            담당자 정보가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (Array.isArray(managerListData)
                          ? managerListData
                          : [managerListData]
                        ).map((row: any) => (
                          <TableRow key={row.managerId}>
                            <TableCell>{row.managerId}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.jobGrade}</TableCell>
                            <TableCell>{row.phoneNumber}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>
                              {dayjs(row.createdAt).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )
          },
          {
            key: 'ip-history',
            label: 'IP 접속 기록',
            children: (
              <Card title="IP 접속 기록" className="mb-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {ipListColumns.map(column => (
                          <TableHead key={column.accessorKey}>
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!ipListData ? (
                        <TableRow>
                          <TableCell
                            colSpan={ipListColumns.length}
                            className="text-center"
                          >
                            로딩 중...
                          </TableCell>
                        </TableRow>
                      ) : ipListData.content.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={ipListColumns.length}
                            className="text-center"
                          >
                            데이터가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        ipListData.content.map((row: IpList) => (
                          <TableRow key={`${row.ipAddress}-${row.updatedAt}`}>
                            <TableCell>{row.memberId}</TableCell>
                            <TableCell>{row.ipAddress}</TableCell>
                            <TableCell>{row.operationType}</TableCell>
                            <TableCell>
                              {dayjs(row.updatedAt).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {ipListData && ipListData.totalElements > 0 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={e => {
                              e.preventDefault();
                              if (ipListPage > 1) {
                                handleIpListTableChange(
                                  ipListPage - 1,
                                  ipListPageSize
                                );
                              }
                            }}
                          />
                        </PaginationItem>
                        {Array.from(
                          {
                            length: Math.ceil(
                              ipListData.totalElements / ipListPageSize
                            )
                          },
                          (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                onClick={e => {
                                  e.preventDefault();
                                  handleIpListTableChange(
                                    i + 1,
                                    ipListPageSize
                                  );
                                }}
                                isActive={i + 1 === ipListPage}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={e => {
                              e.preventDefault();
                              if (
                                ipListPage <
                                Math.ceil(
                                  ipListData.totalElements / ipListPageSize
                                )
                              ) {
                                handleIpListTableChange(
                                  ipListPage + 1,
                                  ipListPageSize
                                );
                              }
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </Card>
            )
          },
          {
            key: 'print-history',
            label: '출력 이력',
            children: (
              <Card title="출력 이력 조회" className="mb-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {printHistoryColumns.map(column => (
                          <TableHead key={column.accessorKey}>
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!printHistoryData ? (
                        <TableRow>
                          <TableCell
                            colSpan={printHistoryColumns.length}
                            className="text-center"
                          >
                            로딩 중...
                          </TableCell>
                        </TableRow>
                      ) : printHistoryData.content.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={printHistoryColumns.length}
                            className="text-center"
                          >
                            데이터가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        printHistoryData.content.map((row: PrintHistory) => (
                          <TableRow key={row.printId}>
                            <TableCell>{row.printId}</TableCell>
                            <TableCell>
                              {dayjs(row.printDate).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                            </TableCell>
                            <TableCell>{row.printType}</TableCell>
                            <TableCell>{row.printCount}</TableCell>
                            <TableCell>{row.accessIp}</TableCell>
                            <TableCell>{row.memberId}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {printHistoryData && printHistoryData.totalElements > 0 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={e => {
                              e.preventDefault();
                              if (printHistoryPage > 1) {
                                handlePrintHistoryTableChange(
                                  printHistoryPage - 1,
                                  printHistoryPageSize
                                );
                              }
                            }}
                          />
                        </PaginationItem>
                        {Array.from(
                          {
                            length: Math.ceil(
                              printHistoryData.totalElements /
                                printHistoryPageSize
                            )
                          },
                          (_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                onClick={e => {
                                  e.preventDefault();
                                  handlePrintHistoryTableChange(
                                    i + 1,
                                    printHistoryPageSize
                                  );
                                }}
                                isActive={i + 1 === printHistoryPage}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={e => {
                              e.preventDefault();
                              if (
                                printHistoryPage <
                                Math.ceil(
                                  printHistoryData.totalElements /
                                    printHistoryPageSize
                                )
                              ) {
                                handlePrintHistoryTableChange(
                                  printHistoryPage + 1,
                                  printHistoryPageSize
                                );
                              }
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </Card>
            )
          }
        ]}
      />

      <Modal
        title="비밀번호 변경"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handlePasswordSubmit} layout="vertical">
          <Form.Item
            name="password"
            label="새 비밀번호"
            rules={[
              { required: true, message: '새 비밀번호를 입력해주세요' },
              { min: 8, message: '비밀번호는 8자 이상이어야 합니다' }
            ]}
          >
            <Input.Password
              placeholder="새 비밀번호를 입력하세요"
              className="h-12 text-lg"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="비밀번호 확인"
            dependencies={['password']}
            rules={[
              { required: true, message: '비밀번호를 다시 입력해주세요' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('비밀번호가 일치하지 않습니다')
                  );
                }
              })
            ]}
          >
            <Input.Password
              placeholder="비밀번호를 다시 입력하세요"
              className="h-12 text-lg"
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsPasswordModalVisible(false)}>
              취소
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              변경
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="구독 종료일 변경"
        open={isSubscriptionModalVisible}
        onCancel={() => setIsSubscriptionModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubscriptionSubmit}
          layout="vertical"
          initialValues={{ isVip: data?.isVip }}
        >
          <Form.Item name="subscriptionEndDate" label="구독 종료일">
            <DatePicker
              placeholder="구독 종료일을 선택하세요"
              format="YYYY-MM-DD"
              className="h-12 text-lg w-full"
            />
          </Form.Item>
          <Form.Item name="isVip" label="VIP 회원">
            <Radio.Group>
              <Radio value={true}>VIP</Radio>
              <Radio value={false}>일반</Radio>
            </Radio.Group>
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsSubscriptionModalVisible(false)}>
              취소
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              변경
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={data.isWithdrawn ? '회원 복구' : '회원 탈퇴'}
        open={isWithdrawModalVisible}
        onCancel={() => setIsWithdrawModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsWithdrawModalVisible(false)}>
            취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger={!data.isWithdrawn}
            onClick={handleWithdraw}
            loading={loading}
          >
            {data.isWithdrawn ? '복구' : '탈퇴'}
          </Button>
        ]}
      >
        <p>
          {data.isWithdrawn
            ? '해당 회원을 복구하시겠습니까?'
            : '해당 회원을 탈퇴 처리하시겠습니까?'}
        </p>
      </Modal>
    </div>
  );
};
