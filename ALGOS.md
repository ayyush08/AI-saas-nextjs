
#### On Sign Up

The code should effectively handle both scenarios of registering a new user and updating an existing but unverified user account with a new password and verification code.

#### Algorithm

1. Check if `existingUserByEmail` exists:
    - If `existingUserByEmail.isVerified` is true:
        - Set `success: false`
    - Else:
        - Save the updated user
2. Else:
    - Create a new user with the provided details
    - Save the new user
