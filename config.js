// 통합 포털 설정 (공개값만 — 비밀키 넣지 말 것)
window.PORTAL_CONFIG = {
  nhostSubdomain: 'ofujfkotwuqgiqiiygpq',
  nhostRegion: 'ap-southeast-1',
  handoffTtlSec: 120, // 서비스 이동용 1회 토큰 유효시간
  // mode: open(포털 로그인 사용자 전원) · nhost/ops/seminar(자동 로그인) · external(외부 모듈, 사이트 자체 로그인)
  services: [
    { key: 'proposal', name: '제안서 생성기', desc: '기관별 맞춤 제안서·웹브로셔·PPT 자동 생성', url: 'https://doctorville.github.io/drville-proposal/', mode: 'open' },
    { key: 'dash', name: '닥터빌 · 팜빌 운영 대시보드', desc: '매출·회원·세미나·광고 지표', url: 'https://doctorville.github.io/doctorville_dash/', mode: 'nhost' },
    { key: 'monthly', name: '팀워크 · 주간 업무 보고', desc: '주간보고·목표·인수인계', url: 'https://doctorville.github.io/monthly/', mode: 'nhost' },
    { key: 'ops', name: '사업부 업무·위험 모니터', desc: '주요업무·KPI·위험신호·요약보고', url: 'https://doctorville-ops-monitor.vercel.app/', mode: 'ops' },
    { key: 'seminar', name: '세미나 관리자', desc: '세미나 일정·신청 현황·진행업체·회원 관리', url: 'https://doctorville.github.io/doctorville-seminar/admin/', mode: 'seminar' },
    // 외부 모듈: 아직 SSO 미연동 → 클릭 시 사이트 자체 로그인. 사이트에 POST /auth/portal 이 생기면 mode 를 'ops' 로 바꾸면 자동 로그인
    { key: 'ad', name: '광고 데이터', desc: '배너·광고 원본 데이터 리포트 (외부 모듈)', url: 'https://doctorville-ad-report.hamme.chatgpt.site/', mode: 'external' },
  ],
}
