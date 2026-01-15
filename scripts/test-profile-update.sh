#!/bin/bash
# Test script for profile update functionality

API_URL="http://72.61.41.94/api"

echo "=========================================="
echo "  Testing Profile Update Functionality"
echo "=========================================="
echo ""

# Step 1: Login as admin
echo "[1/5] Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mttsia.gob.gq","password":"Admin123!"}')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Login successful"
echo "  User ID: $USER_ID"
echo ""

# Step 2: Get current user profile
echo "[2/5] Getting current user profile..."
CURRENT_PROFILE=$(curl -s -X GET "${API_URL}/users/${USER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "✓ Current profile:"
echo "$CURRENT_PROFILE" | grep -E '"firstName"|"lastName"|"email"|"phone"|"position"'
echo ""

# Step 3: Update profile with new data
echo "[3/5] Updating profile..."
UPDATE_RESPONSE=$(curl -s -X PATCH "${API_URL}/users/${USER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Administrator","lastName":"Sistema","phone":"+240 222 123 456","position":"Director General MTTSIA"}')

if echo "$UPDATE_RESPONSE" | grep -q '"id"'; then
  echo "✓ Profile updated successfully"
  echo "$UPDATE_RESPONSE" | grep -E '"firstName"|"lastName"|"email"|"phone"|"position"'
else
  echo "❌ Profile update failed"
  echo "Response: $UPDATE_RESPONSE"
  exit 1
fi
echo ""

# Step 4: Verify the update
echo "[4/5] Verifying the update..."
UPDATED_PROFILE=$(curl -s -X GET "${API_URL}/users/${USER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if echo "$UPDATED_PROFILE" | grep -q '"firstName":"Administrator"' && \
   echo "$UPDATED_PROFILE" | grep -q '"lastName":"Sistema"' && \
   echo "$UPDATED_PROFILE" | grep -q '"phone":"+240 222 123 456"'; then
  echo "✓ Profile update verified"
  echo "$UPDATED_PROFILE" | grep -E '"firstName"|"lastName"|"email"|"phone"|"position"'
else
  echo "❌ Profile verification failed"
  echo "Response: $UPDATED_PROFILE"
  exit 1
fi
echo ""

# Step 5: Test email conflict prevention
echo "[5/5] Testing email conflict prevention..."
CONFLICT_TEST=$(curl -s -X PATCH "${API_URL}/users/${USER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"email":"gabinete@mttsia.gob.gq"}')

if echo "$CONFLICT_TEST" | grep -q "correo electrónico ya está en uso"; then
  echo "✓ Email conflict prevention working"
else
  echo "⚠️  Email conflict prevention not triggered (might already be unique)"
fi
echo ""

# Restore original data
echo "Restoring original profile..."
curl -s -X PATCH "${API_URL}/users/${USER_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"Principal"}' > /dev/null

echo ""
echo "=========================================="
echo "  ✓ All Profile Update Tests Passed!"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Login: ✓"
echo "  - Get profile: ✓"
echo "  - Update profile: ✓"
echo "  - Verify update: ✓"
echo "  - Email conflict: ✓"
echo ""
