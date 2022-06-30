docker run \
-e SOURCE_PROJECT_KEY="peloton-ecomm-prod" \
-e SOURCE_CLIENT_ID="4gtKCZydmsq6RUYhG24YsMUy" \
-e SOURCE_CLIENT_SECRET="yboChd0fjB1dyqy7gdiISqfxHgBxxT1Y" \
-e TARGET_PROJECT_KEY="peloton-ecomm-stage" \
-e TARGET_CLIENT_ID="R0qI12Ed_S1EPxyVjPGoRp-2" \
-e TARGET_CLIENT_SECRET="kRKu5Y3lje6t1XQzYwuyyTykuSTQF21E" \
-e SOURCE_AUTH_URL="https://auth.us-central1.gcp.commercetools.com" \
-e SOURCE_API_URL="https://api.us-central1.gcp.commercetools.com" \
-e TARGET_AUTH_URL="https://auth.us-central1.gcp.commercetools.com" \
-e TARGET_API_URL="https://api.us-central1.gcp.commercetools.com" \
commercetools/commercetools-project-sync:5.3.0 -s products -f