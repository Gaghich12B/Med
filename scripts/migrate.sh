#!/bin/sh
# Run Prisma migrations using a direct (non-pooler) database connection.
#
# Neon's pgbouncer pooler URLs look like:
#   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db
#
# The direct URL is the same but without "-pooler" in the hostname:
#   postgresql://user:pass@ep-xxx.region.aws.neon.tech/db
#
# If DIRECT_URL is already set in the environment, use it as-is.
# Otherwise, derive it automatically from DATABASE_URL by removing "-pooler"
# from the hostname.  If DATABASE_URL is not a pooler URL the sed replacement
# is a no-op, so this is safe for any Postgres connection string.

if [ -z "$DATABASE_URL" ]; then
  echo "migrate.sh: DATABASE_URL is not set — skipping migrations."
  exit 0
fi

if [ -n "$DIRECT_URL" ]; then
  MIGRATION_URL="$DIRECT_URL"
else
  # Strip -pooler from the hostname so we get a direct connection.
  MIGRATION_URL=$(echo "$DATABASE_URL" | sed 's/-pooler\.\(.*\.neon\.tech\)/.\1/')
fi

echo "migrate.sh: running prisma migrate deploy..."
DATABASE_URL="$MIGRATION_URL" npx prisma migrate deploy
exit $?
