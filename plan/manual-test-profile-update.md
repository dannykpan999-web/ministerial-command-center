# Manual Testing Guide - Profile Update Feature

## Test Environment
- **URL**: http://72.61.41.94
- **Date**: January 15, 2026
- **Status**: ✓ Deployed and Ready for Testing

---

## Test Credentials

Use any of these accounts to test the profile update feature:

### Admin Account
- **Email**: admin@mttsia.gob.gq
- **Password**: Admin123!
- **Current Name**: Admin System
- **Role**: ADMIN

### Gabinete Account
- **Email**: gabinete@mttsia.gob.gq
- **Password**: Gabinete123!
- **Current Name**: Juan Pérez García
- **Role**: GABINETE

### Revisor Account
- **Email**: revisor@mttsia.gob.gq
- **Password**: Revisor123!
- **Current Name**: María González López
- **Role**: REVISOR

### Lector Account
- **Email**: lector@mttsia.gob.gq
- **Password**: Lector123!
- **Current Name**: Carlos Martínez Ruiz
- **Role**: LECTOR

---

## Test Case 1: Access Profile Modal

### Steps:
1. Open http://72.61.41.94 in your browser
2. Log in with any test account
3. After successful login, you'll see the dashboard
4. Look at the top-right corner of the page
5. Click on your **profile avatar** (shows your initials)
6. A dropdown menu will appear
7. Click on **"Configuración"** (Settings) menu item

### Expected Result:
✓ A modal dialog opens titled "Mi Perfil" (My Profile)
✓ Modal shows:
  - Your avatar with initials
  - Your full name
  - Your email
  - Your role badge
  - Editable fields:
    - Nombre (First Name) - with User icon
    - Apellido (Last Name) - with User icon
    - Correo electrónico (Email) - with Mail icon
    - Teléfono (Phone) - with Phone icon - optional
    - Cargo (Position) - with Briefcase icon - optional
    - Rol (Role) - with Shield icon - disabled/read-only
  - Statistics card showing document counts
  - Two buttons: "Cancelar" and "Guardar cambios"

---

## Test Case 2: Update Profile Information

### Steps:
1. Open the profile modal (follow Test Case 1)
2. The form fields should be pre-filled with your current information
3. **Modify the following fields**:
   - Change "Nombre" to: "Updated"
   - Change "Apellido" to: "TestUser"
   - Change "Teléfono" to: "+240 222 333 444"
   - Change "Cargo" to: "Director de Pruebas"
4. Click the **"Guardar cambios"** button

### Expected Result:
✓ Button shows loading spinner with text "Guardando..."
✓ All form fields become disabled during save
✓ After 1-2 seconds, the modal **closes automatically**
✓ You return to the dashboard
✓ Your name in the top-right corner updates to "Updated TestUser"

### Verification:
1. Click the profile avatar again
2. Click "Configuración" to reopen the modal
3. Verify the fields now show:
   - Nombre: Updated
   - Apellido: TestUser
   - Teléfono: +240 222 333 444
   - Cargo: Director de Pruebas

---

## Test Case 3: Cancel Without Saving

### Steps:
1. Open the profile modal
2. Change some fields (e.g., change first name)
3. Click the **"Cancelar"** button

### Expected Result:
✓ Modal closes immediately
✓ No changes are saved
✓ If you reopen the modal, fields show original values

---

## Test Case 4: Email Conflict Prevention

### Steps:
1. Log in as **Admin** (admin@mttsia.gob.gq)
2. Open the profile modal
3. Try to change email to: **gabinete@mttsia.gob.gq** (another existing user)
4. Click "Guardar cambios"

### Expected Result:
✓ A red error alert appears at the top of the modal
✓ Error message: "El correo electrónico ya está en uso"
✓ Modal stays open
✓ Form fields remain editable
✓ You can correct the email or cancel

---

## Test Case 5: Required Fields Validation

### Steps:
1. Open the profile modal
2. Clear the "Nombre" (First Name) field completely
3. Try to click "Guardar cambios"

### Expected Result:
✓ Browser validation prevents submission
✓ Field shows as invalid
✓ Modal stays open

---

## Test Case 6: Role is Not Editable

### Steps:
1. Open the profile modal
2. Look at the "Rol" (Role) field

### Expected Result:
✓ The "Rol" field is disabled (grayed out)
✓ You cannot click or edit it
✓ It shows your current role (ADMIN, GABINETE, REVISOR, or LECTOR)
✓ This is a security feature - roles can only be changed by admins through other means

---

## Test Case 7: Optional Fields

### Steps:
1. Open the profile modal
2. Leave "Teléfono" and "Cargo" fields empty
3. Update only "Nombre" and "Apellido"
4. Click "Guardar cambios"

### Expected Result:
✓ Update succeeds
✓ Modal closes
✓ Phone and position remain empty (not required)

---

## Test Case 8: Network Error Handling

### Steps:
1. Open the profile modal
2. Disconnect your internet (or use browser DevTools to simulate offline)
3. Try to save changes

### Expected Result:
✓ An error message appears in the modal
✓ Modal stays open so you can try again
✓ Form fields remain editable

---

## Test Case 9: Token Refresh During Session

### Steps:
1. Log in and wait 14+ minutes (access token expires in 15 minutes)
2. Open the profile modal and make changes
3. Click "Guardar cambios"

### Expected Result:
✓ If you have "Remember me" enabled, token auto-refreshes
✓ Update succeeds normally
✓ If token expired and no refresh token, you're redirected to login

---

## Test Case 10: Multiple Updates in Same Session

### Steps:
1. Open profile modal and update name to "Test1"
2. Save and close
3. Open profile modal again and update name to "Test2"
4. Save and close
5. Open profile modal again and update name to "Test3"
6. Save and close

### Expected Result:
✓ All three updates succeed
✓ Each time modal closes after successful save
✓ Final verification shows name as "Test3"

---

## Visual Checks

### Icons Should Display Correctly:
- ✓ User icon on Nombre field
- ✓ User icon on Apellido field
- ✓ Mail icon on Email field
- ✓ Phone icon on Teléfono field
- ✓ Briefcase icon on Cargo field
- ✓ Shield icon on Rol field
- ✓ Shield icon on role badge

### Layout Should Be:
- ✓ Modal centered on screen
- ✓ Maximum width: medium (max-w-md)
- ✓ All fields properly aligned
- ✓ Icons aligned to left inside inputs
- ✓ Buttons aligned to right at bottom
- ✓ Statistics card displays nicely

### Color Scheme:
- ✓ Primary color (navy blue) on focused fields
- ✓ Red color on error messages
- ✓ Gray color on disabled Role field
- ✓ Icons in muted gray, turn primary on hover

---

## Mobile Responsiveness Test

### Steps:
1. Open http://72.61.41.94 on mobile device or use browser DevTools mobile view
2. Log in and access profile modal

### Expected Result:
✓ Modal adapts to mobile screen
✓ Fields stack vertically on small screens
✓ Buttons remain accessible
✓ All functionality works on touch devices

---

## Browser Compatibility

Test on multiple browsers:
- ✓ Chrome/Edge (Chromium)
- ✓ Firefox
- ✓ Safari (if available)

All features should work identically across browsers.

---

## Post-Testing Cleanup

After testing, you may want to restore user data:

### Restore Admin User:
1. Log in as admin
2. Open profile modal
3. Change back to:
   - Nombre: Admin
   - Apellido: Principal (or System)
   - Clear phone and position if desired
4. Save changes

---

## Quick Verification Checklist

Use this checklist to quickly verify all features:

- [ ] Modal opens when clicking Settings in dropdown
- [ ] All fields pre-fill with current user data
- [ ] First name field is editable
- [ ] Last name field is editable
- [ ] Email field is editable
- [ ] Phone field is editable (optional)
- [ ] Position field is editable (optional)
- [ ] Role field is disabled (not editable)
- [ ] Save button shows loading spinner
- [ ] **Modal closes automatically after successful save**
- [ ] User name updates in header after save
- [ ] Cancel button closes modal without saving
- [ ] Email conflict shows error message
- [ ] Error messages display in red at top of modal
- [ ] Icons display correctly on all fields
- [ ] Statistics card displays
- [ ] Modal closes on successful save
- [ ] Changes persist after reopening modal

---

## Troubleshooting

### If Modal Doesn't Open:
- Check browser console for JavaScript errors
- Verify you're logged in (token valid)
- Try refreshing the page

### If Save Button Doesn't Work:
- Check browser console for errors
- Verify network connectivity
- Check that backend is running: http://72.61.41.94/api/health

### If Changes Don't Persist:
- Verify backend API is responding
- Check browser network tab for 200 response
- Verify database connection on server

### Backend Health Check:
```bash
curl http://72.61.41.94/api/health
# Should return: {"status":"ok"}
```

### Check Backend Logs:
```bash
ssh root@72.61.41.94 "pm2 logs ministerial-api --lines 50"
```

---

## Success Criteria

All tests pass if:
1. ✓ Modal opens and displays correctly
2. ✓ All fields are editable (except Role)
3. ✓ Form pre-fills with current data
4. ✓ Save button triggers update
5. ✓ Loading state displays during save
6. ✓ **Modal closes automatically on successful save**
7. ✓ Changes persist in database
8. ✓ Error messages display correctly
9. ✓ Email conflict prevention works
10. ✓ User name updates in header

---

## Conclusion

The profile update feature is production-ready when all test cases pass. The key functionality is that **the modal should close automatically after successfully saving changes**, and the updated information should be visible immediately in the header.

**Status**: Ready for Manual Testing ✓
**URL**: http://72.61.41.94
**Last Deployed**: January 15, 2026, 16:04 UTC
