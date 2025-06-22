'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Button as MuiButton,
  Box,
  Stack,
  Typography,
  Divider
} from '@mui/material';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { login_code, resendCode, sendSmsCode } from '@/entities/MainBanner/api';
import { colors } from '@/design-tokens';

// SMS 인증 API 함수 추가
const sendSMSCode = async (username: string) => {
  try {
    const response = await fetch('/api/auth/sms-send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (!response.ok) {
      throw new Error('SMS 전송에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const TwoFAModal = () => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [isSMSLoading, setIsSMSLoading] = useState(false);

  const { submit2FACode, requires2FA, set2FAState, tempUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!requires2FA) return;

    setCode('');
    setError('');
    setTimeLeft(180);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          set2FAState(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [requires2FA]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    const success = await submit2FACode(code);
    if (success) {
      setError('');
      router.push('/');
    } else {
      setError('인증 코드가 올바르지 않습니다. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    set2FAState(false);
  };

  const handleResend = async () => {
    if (!tempUser) return;
    try {
      await resendCode({
        username: tempUser.id
      });
      setSnackbarMessage('인증 코드가 재전송되었습니다.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeLeft(180);
      setError('');
    } catch (e) {
      setError('재전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSMSSend = async () => {
    if (!tempUser) return;

    setIsSMSLoading(true);
    try {
      await sendSmsCode({ username: tempUser.id });
      setSnackbarMessage('SMS 인증 코드가 전송되었습니다.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeLeft(180);
      setError('');
    } catch (e) {
      setSnackbarMessage('SMS 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSMSLoading(false);
    }
  };

  return (
    <>
      <Dialog open={requires2FA} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          휴대폰 인증
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1" textAlign="center">
              새로운 IP에서 로그인되었습니다. 등록된 휴대폰으로 인증 코드가
              전송되었습니다.
            </Typography>

            <Box textAlign="center">
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: colors.brand[400] }}
              >
                남은 시간: {formatTime(timeLeft)}
              </Typography>
            </Box>

            <TextField
              label="인증 코드"
              variant="outlined"
              fullWidth
              value={code}
              onChange={e => setCode(e.target.value)}
              error={!!error}
              helperText={error}
              inputProps={{ maxLength: 6 }}
            />

            <Box
              sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}
            >
              <MuiButton
                onClick={handleResend}
                size="small"
                sx={{
                  textTransform: 'none',
                  color: colors.brand[400]
                }}
              >
                인증 코드 재전송
              </MuiButton>

              <MuiButton
                onClick={handleSMSSend}
                size="small"
                disabled={isSMSLoading}
                sx={{
                  textTransform: 'none',
                  color: colors.brand[400],
                  border: `1px solid ${colors.brand[400]}`,
                  '&:hover': {
                    backgroundColor: colors.brand[100]
                  }
                }}
              >
                {isSMSLoading ? '전송 중...' : 'SMS 인증'}
              </MuiButton>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MuiButton
            onClick={handleClose}
            variant="outlined"
            sx={{ borderColor: colors.brand[400], color: colors.brand[400] }}
          >
            취소
          </MuiButton>
          <MuiButton
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: colors.brand[400],
              '&:hover': {
                backgroundColor: colors.brand[400]
              }
            }}
          >
            확인
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
