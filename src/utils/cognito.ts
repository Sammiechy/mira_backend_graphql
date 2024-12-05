// src/utils/cognito.ts
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'your-region',
});

const cognito = new AWS.CognitoIdentityServiceProvider();

export async function signUpUser(email: string, password: string) {
  const params = {
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    const result = await cognito.signUp(params).promise();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to sign up user');
  }
}
