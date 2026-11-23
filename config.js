// 통합 포털 설정 (공개값만 — 비밀키 넣지 말 것)
window.PORTAL_CONFIG = {
  nhostSubdomain: 'ofujfkotwuqgiqiiygpq',
  nhostRegion: 'ap-southeast-1',
  handoffTtlSec: 120, // 서비스 이동용 1회 토큰 유효시간
  services: [
    { key: 'proposal', name: '제안서 생성기', desc: '기관별 맞춤 제안서·웹브로셔·PPT 자동 생성', url: 'https://doctorville.github.io/drville-proposal/', mode: 'open' },
    { key: 'dash', name: '닥터빌 · 팜빌 운영 대시보드', desc: '매출·회원·세미나·광고 지표', url: 'https://doctorville.github.io/doctorville_dash/', mode: 'nhost' },
    { key: 'monthly', name: '팀워크 · 주간 업무 보고', desc: '주간보고·목표·인수인계', url: 'https://doctorville.github.io/monthly/', mode: 'nhost' },
    { key: 'ops', name: '사업부 업무·위험 모니터', desc: '주요업무·KPI·위험신호·요약보고', url: 'https://doctorville-ops-monitor.vercel.app/', mode: 'ops' },
  ],
}
