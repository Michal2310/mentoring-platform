  ## Mentoring Platfrom
![Codacy Badge](https://app.codacy.com/project/badge/Grade/f8b7d691a85f4206ba457d8486a0cee0)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![Top Language](https://img.shields.io/github/languages/top/Michal2310/mentoring-platform)](https://github.com/Michal2310/mentoring-platform)
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Mentoring Platform is a place where anyone can become a mentor as well as a disciple of a particular mentor at no charge. We make it possible to conduct online meetings in real time as well as text chat and all this on our platform

## 📖 Table of Contents

- [🛠 Tech stack](#-tech-stack-)
- [🎛️ API](#️-api-)
- [💾 Install](#-install-)
- [🧪 Test](#-test-)

## 🛠 Tech stack [🔝](#-table-of-contents)

[![My Tech Stack](https://github-readme-tech-stack.vercel.app/api/cards?showBorder=false&lineCount=2&theme=tokyonight&hideBg=true&hideTitle=true&line1=NestJS,NestJS,E0234E;typescript,typescript,3178C6;Amazon%20S3,Amazon%20S3,569A31;&line2=prisma,prisma,2D3748;PostgreSQL,PostgreSQL,4169E1;JSON%20Web%20Tokens,JSON%20Web%20Tokens,000000;)](https://github-readme-tech-stack.vercel.app/api/cards?showBorder=false&lineCount=2&theme=tokyonight&hideBg=true&hideTitle=true&line1=NestJS,NestJS,E0234E;typescript,typescript,3178C6;Amazon%20S3,Amazon%20S3,569A31;&line2=prisma,prisma,2D3748;PostgreSQL,PostgreSQL,4169E1;JSON%20Web%20Tokens,JSON%20Web%20Tokens,000000;)

## 🎛️ API [🔝](#-table-of-contents)

#### Account

```
  GET /account
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |

```
  PATCH /account
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `oldPassword`    | `string` | **Required**. password of user         |
| `newPassword`    | `string` | **Required**. new password of user     |

### Auth

```
  POST /auth/register
```


| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `email`    | `string` | **Required**. email of user         |
| `password`    | `string` | **Required**. password of user     |

```
  POST /auth/login
```


| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `email`    | `string` | **Required**. email of user         |
| `password`    | `string` | **Required**. password of user     |

```
  POST /auth/logout
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |

```
  POST /auth/refresh
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |

```
  GET /auth/verificationToken
```

| Query             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|  `verificationToken`   | `string` | **Required**. Token assigned to the user account in the registration process         |
| `email`    | `string` | **Required**. email of user         |


### Mentors

```
  GET /mentor/mentors
```

| Query             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `page`    | `number` | **Required**. The page you want to display         |

```
  GET /mentor/mentor/:id
```

| Param             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `id`    | `number` | **Required**. ID of the mentor you want to display      |


```
  POST /mentor/
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `firstname`    | `string` | **Required**. User firstname      |
| `lastname`    | `string` | **Required**. User lastname      |
| `about`    | `string` | **Required**. User short description      |
| `title`    | `string` | **Required**. User job title      |
| `country`    | `string` | **Required**. User country      |
| `languages`    | `string[]` | **Required**. Languages the user knows      |
| `skills`    | `string[]` | **Required**. Skills possessed by the user      |

```
  POST /mentor/:id
```

| Param              | Type         | Description                            |
| :----------------- | :----------- | :------------------------------------- |
| `id`               | `number`     | **Required**. ID of the mentor whose application you want to update |
                     
| Query              | Type         | Description                            |
| :----------------- | :----------- | :------------------------------------- |
| `status`           | `StatusType` | **Required**. Accepted or Rejected status of application |

### Mentorship

```
  POST /mentorship/:mentorship
```

| Param             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `mentorId`    | `number` | **Required**. ID of the mentor you want to send the request to |

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `background`    | `number` | **Required**. User experience with programming and what you can do |
| `expectations`    | `number` | **Required**. Expectations from the mentor what you want to learn |
| `message`    | `number` | **Required**. A short message to the mentor |

```
  GET /mentorship/myrequests
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |

```
  GET /mentorship/receivedRequests
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |

```
  PATCH /mentorship/:id
```

| Param             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|  `id`   | `number` |  **Required**. ID of the request sent to the mentor        |

| Query             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
| `status`    | `StatusType` | **Required**. Accepted or Rejected status of application |

### Upload

```
  POST /upload
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|  `file`   | `file` |  **Required**. The photo the user wants to set as a profile picture. Only the extension as `jpeg` or `png`         |

```
  DELETE /upload
```

| Body             | Type     | Description                            |
| :--------------- | :------- | :------------------------------------- |
|     |  |          |






## 💾 Install [🔝](#-table-of-contents)

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Test [🔝](#-table-of-contents)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
