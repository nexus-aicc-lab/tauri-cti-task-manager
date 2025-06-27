/** @type {import('tailwindcss').Config} */
export default {
    // 자동 스캔 안 되는 경우, 수동으로 넣어야 함
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    theme: {
        extend: {
            // 여기에 원하는 커스텀 설정들을 넣기
        },
    },
    plugins: [
        // 필요하면 여기에 플러그인 추가
    ],
}
