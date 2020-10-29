import { createUserMutation, removeUserMutation } from './user.request.params';
import { graphqlRequest } from '../utils/graphql.request';
import '../utils/array.matcher';
import { appSingleton } from '../utils/app.singleton';

let userName = '';
let userId = '';
let userPhone = '';
let userEmail = '';

beforeAll(async () => {
  if (!appSingleton.Instance.app) await appSingleton.Instance.initServer();
});

afterAll(async () => {
  if (appSingleton.Instance.app) await appSingleton.Instance.teardownServer();
});

beforeEach(() => {
  userName = 'testUser ' + Math.random().toString();
  userPhone = 'userPhone ' + Math.random().toString();
  userEmail = Math.random().toString() + '@test.com';
});

describe('Create User', () => {
  afterEach(async () => {
    await removeUserMutation(userId);
  });

  test('should create a user', async () => {
    // Act
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.data.createUser.name).toEqual(userName);
  });

  test.skip('should throw error - same user is created twice', async () => {
    // Arrange
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;

    // Act
    const responseSecondTime = await createUserMutation(userName);
    userId = responseSecondTime.body.data.createUser.id;

    // Assert
    expect(responseSecondTime.status).toBe(200);
    expect(responseSecondTime.body.data.createUserMutation).toEqual(false);
  });

  test('should query created user', async () => {
    // Arrange
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;

    // Act
    const requestParamsQueryUser = {
      query: `{user(ID: "${userId}") {
          name
          id
        }}`,
    };
    const responseQuery = await graphqlRequest(requestParamsQueryUser);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.body.data.user.name).toEqual(userName);
  });

  test('should query created user details', async () => {
    // Arrange
    const requestParams = {
      operationName: 'CreateUser',
      query: `mutation CreateUser($userData: UserInput!) {
          createUser(userData: $userData) {
            id
            name
            firstName
            lastName
            email
            phone
            city
            country
            gender
            profile {
              references {
                name
              }
            }
            memberof {
              groups {
                name
              }
            }
          }
        }`,
      variables: {
        userData: {
          name: 'test77',
          firstName: 'testFN',
          lastName: 'testLN',
          email: 'testEmail@test.com',
          phone: '092834',
          city: 'testCity',
          country: 'testCountry',
          gender: 'testGender',
        },
      },
    };

    const responseQuery = await graphqlRequest(requestParams);
    userId = responseQuery.body.data.createUser.id;
    // Act
    const requestParamsQueryUser = {
      query: `{user(ID: "${userId}")
                  {
                    name
                    firstName
                    lastName
                    email
                    phone
                    city
                    country
                    gender
                    profile {
                      references {
                        name
                      }
                    }
                    memberof {
                      groups {
                        name
                      }
                    }
                  }
                }`,
    };
    const responseParamsQueryUser = await graphqlRequest(
      requestParamsQueryUser
    );

    // Assert
    expect(responseParamsQueryUser.status).toBe(200);
    expect(responseParamsQueryUser.body.data.user.name).toEqual('test77');
    expect(responseParamsQueryUser.body.data.user.firstName).toEqual('testFN');
    expect(responseParamsQueryUser.body.data.user.lastName).toEqual('testLN');
    expect(responseParamsQueryUser.body.data.user.email).toEqual(
      'testEmail@test.com'
    );
    expect(responseParamsQueryUser.body.data.user.phone).toEqual('092834');
    expect(responseParamsQueryUser.body.data.user.city).toEqual('testCity');
    expect(responseParamsQueryUser.body.data.user.country).toEqual(
      'testCountry'
    );
    expect(responseParamsQueryUser.body.data.user.gender).toEqual('testGender');
    expect(responseParamsQueryUser.body.data.user.profile).toEqual({
      references: [],
    });
    expect(responseParamsQueryUser.body.data.user.memberof).toEqual({
      email: 'testEmail@test.com',
    });
  });

  test('should throw error - create user with ID instead of name', async () => {
    // Arrange
    const requestParams = {
      operationName: 'CreateUser',
      query:
        'mutation CreateUser($userData: UserInput!) {createUser(ID: id) { id name }}',
      variables: {
        userData: {
          id: 12,
        },
      },
    };

    // Act
    const responseQuery = await graphqlRequest(requestParams);

    // Assert
    expect(responseQuery.status).toBe(400);
  });

  test('should throw error - create user with LONG NAME', async () => {
    // Arrange
    const requestParams = {
      operationName: 'CreateUser',
      query:
        'mutation CreateUser($userData: UserInput!) {createUser(userData: $userData) { id name }}',
      variables: {
        userData: {
          name:
            'very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name',
          email: userEmail,
          firstName: 'testFN',
          lastName: 'testLN'
        },
      },
    };

    // Act
    const responseQuery = await graphqlRequest(requestParams);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.text).toContain(
      'ER_DATA_TOO_LONG: Data too long for column \'name\' at row 1'
    );
  });

  test('should throw error - create user with invalid email', async () => {
    // Arrange
    const requestParams = {
      operationName: 'CreateUser',
      query:
        'mutation CreateUser($userData: UserInput!) {createUser(userData: $userData) { id name }}',
      variables: {
        userData: {
          name: 'name',
          firstName: 'name',
          lastName: 'name',
          email: 'testEmail',
        },
      },
    };

    // Act
    const responseQuery = await graphqlRequest(requestParams);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.text).toContain(
      'Valid email address required to create a user: testEmail'
    );
  });
});
