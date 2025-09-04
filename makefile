run:
	@pnpm run dev
pformat:
	@pnpx prisma format
pgenerate:
	@pnpx prisma generate
pdpush:
	@pnpx prisma db push
pclean:
	@rm -rf generated
pstudio:
	@pnpx prisma studio
