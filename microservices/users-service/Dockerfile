FROM oven/bun:1.3.0

WORKDIR /app

COPY package.json tsconfig.json drizzle.config.ts ./
## COPY src ./src

RUN bun install

EXPOSE 4001

CMD ["sh", "-c", "bun run db:generate && bun run db:push && bun run dev"]