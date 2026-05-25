import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Layers } from 'lucide-react';
import * as api from '../api';
import '../assets/css/login.css';

export default function Login() {
	const navigate = useNavigate();
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!isLoginMode && formData.password !== formData.confirmPassword) {
			setError('비밀번호가 일치하지 않습니다.');
			return;
		}

		setLoading(true);
		try {
			if (isLoginMode) {
				await api.login(formData.email, formData.password);
			} else {
				await api.register(formData.email, formData.password);
				await api.login(formData.email, formData.password);
			}
			navigate('/');
		} catch (err: unknown) {
			const detail = (
				err as { response?: { data?: { detail?: string } } }
			)?.response?.data?.detail;
			setError(
				typeof detail === 'string' ? detail : '요청에 실패했습니다.',
			);
		} finally {
			setLoading(false);
		}
	};

	const toggleMode = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLoginMode(!isLoginMode);
		setError('');
	};

	return (
		<div className="auth-container">
			{/* Left side branding */}
			<div className="auth-branding">
				<div className="brand-logo">
					<div className="brand-logo-icon">
						<Layers size={20} strokeWidth={2.5} />
					</div>
					Florence
				</div>

				<div className="brand-copy">
					<h1>
						약국 관리를
						<br />더 스마트하게
					</h1>
					<p>
						기후 데이터 기반 판매 예측부터
						<br />
						실시간 재고 관리까지, 플로렌스와 함께
						<br />
						효율적인 약국 운영을 시작해보세요.
					</p>
				</div>
			</div>

			{/* Right side form */}
			<div className="auth-form-wrapper">
				<div className="form-header">
					<h2>{isLoginMode ? '로그인' : '회원가입'}</h2>
					<p>
						{isLoginMode
							? '다시 오신 것을 환영합니다.'
							: '플로렌스의 새로운 파트너가 되어주세요.'}
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label className="form-label">이메일 주소</label>
						<div className="input-wrapper">
							<Mail className="input-icon" />
							<input
								type="email"
								name="email"
								className="form-input"
								placeholder="florence@example.com"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className={!isLoginMode ? 'form-row' : ''}>
						<div
							className="form-group"
							style={{
								marginBottom: isLoginMode ? '24px' : '0',
							}}
						>
							<label className="form-label">비밀번호</label>
							<div className="input-wrapper">
								<Lock className="input-icon" />
								<input
									type="password"
									name="password"
									className="form-input"
									placeholder="8자 이상 입력"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						{!isLoginMode && (
							<div className="form-group">
								<label className="form-label">
									비밀번호 확인
								</label>
								<div className="input-wrapper">
									<Lock className="input-icon" />
									<input
										type="password"
										name="confirmPassword"
										className="form-input"
										placeholder="비밀번호 재입력"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
									/>
								</div>
							</div>
						)}
					</div>

					{error && <p className="auth-error">{error}</p>}

					<button
						type="submit"
						className="btn-submit"
						disabled={loading}
					>
						{loading
							? '처리 중...'
							: isLoginMode
								? '로그인'
								: '가입하기'}
					</button>
				</form>

				<div className="auth-footer">
					{isLoginMode
						? '아직 계정이 없으신가요?'
						: '이미 계정이 있으신가요?'}
					<a href="#" onClick={toggleMode}>
						{isLoginMode ? '회원가입' : '로그인'}
					</a>
				</div>
			</div>
		</div>
	);
}
