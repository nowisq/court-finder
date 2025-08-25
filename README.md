This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 배포

### Vercel 배포

1. **Vercel CLI 설치**

   ```bash
   npm i -g vercel
   ```

2. **프로젝트 배포**

   ```bash
   vercel
   ```

3. **환경 변수 설정**
   - Vercel 대시보드에서 환경 변수 설정
   - `NEXT_PUBLIC_API_URL`: API 서버 URL
   - `NEXT_PUBLIC_MAPLIBRE_TOKEN`: MapLibre 토큰

### 수동 배포

```bash
# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 배포 전 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] 빌드 테스트 통과 (`pnpm build`)
- [ ] 타입 체크 통과 (`pnpm type-check`)
- [ ] 린트 통과 (`pnpm lint`)

## 📚 추가 리소스

- [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel 플랫폼](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
