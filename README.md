[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Build Status](https://travis-ci.com/andela/vale-ah-backend.svg?branch=develop)](https://travis-ci.com/andela/vale-ah-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/vale-ah-backend/badge.svg?branch=develop)](https://coveralls.io/github/andela/vale-ah-backend?branch=develop)

Naija Chop Chop - A Social platform for Foodies.
=======

## Vision
Create a community of like minded foodies to foster the spead of delicious Nigerian delicacies 
by leveraging the modern web.

---

## API Spec
The preferred JSON object to be returned by the API should be structured as follows:

### Users (for authentication)

```source-json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}
```
### Profile
```source-json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "image-link",
    "following": false
  }
}
```
### Single Recipe
```source-json
{
  "recipe": {
    "title": "How to prepare your finest recipe",
    "slug": "how-to-prepare-your-finest-recipe-4ac3f232"
    "ingredients": ['A spoon of awesomeness', 'A cup of dedication'],
    "steps": {
      "1": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jp"']
      },
      "2": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jpg"]
      }
    },
    "cookingTime": 1000,
    "preparationTime": 3000
    "tags": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "user": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```
### Multiple Recipes
```source-json
{
  "recipes":[{
    "title": "How to prepare your finest recipe",
    "slug": "how-to-prepare-your-finest-recipe-4ac3f232"
    "ingredients": ['A spoon of awesomeness', 'A cup of dedication'],
    "steps": {
      "1": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jp"']
      },
      "2": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jpg"]
      }
    },
    "cookingTime": 1000,
    "preparationTime": 3000
    "tags": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "user": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }, {
    "title": "How to prepare your finest recipe",
    "slug": "how-to-prepare-your-finest-recipe-6dc3a327"
    "ingredients": ['A spoon of awesomeness', 'A cup of dedication'],
    "steps": {
      "1": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jp"']
      },
      "2": {
        description: "Add a spoon of awesomeness to the mixer",
        images: ["https://i.stack.imgur.com/xHWG8.jpg"]
      }
    },
    "cookingTime": 1000,
    "preparationTime": 3000
    "tags": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "user": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
  }],
  "page": 1,
  "pageCount": 1,
  "itemsOnPage": 2
}
```
### Single Comment
```source-json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "user": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```
### Multiple Comments
```source-json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "user": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "commentsCount": 1
}
```
### List of Tags
```source-json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
```
### Errors and Status Codes
If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
### Other status codes:
401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request


Endpoints:
----------

### Authentication:

`POST /api/users/login`

Example request body:

```source-json
{
  "email": "jake@jake.jake",
  "password": "jakejake"
}
```

No authentication required, returns a User

Required fields: `email`, `password`

### Registration:

`POST /api/users`

Example request body:

```source-json
{
  "username": "Jacob",
  "email": "jake@jake.jake",
  "password": "jakejake"
}
```

No authentication required, returns a User

Required fields: `email`, `username`, `password`

### Get Current User

`GET /api/user`

Authentication required, returns a User that's the current user

### Update User

`PUT /api/user`

Example request body:

```source-json
{
  "email": "jake@jake.jake",
  "bio": "I like to skateboard",
  "image": "https://i.stack.imgur.com/xHWG8.jpg"
}
```

Authentication required, returns the User

Accepted fields: `email`, `username`, `password`, `image`, `bio`

### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a Profile

### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

### List Recipes

`GET /api/recipes`

Returns most recent recipes globally by default, provide `tag`, `user`, `favorited` or `minCookTime & maxCookTime` query parameters to filter results

Query Parameters:

Filter by tag:

`?tag=hot`

Filter by user:

`?user=jake`

Filter by cooking time range (minutes)

`?minCookTime=100&maxCookTime=500`

Favorited by user:

`?favorited=jake`

Limit number of recipes (default is 20):

`?limit=20`

Offset/skip number of recipes (default is 0):

`?offset=0`

Authentication optional, will return multiple recipes, ordered by most recent first

### Feed Recipes

`GET /api/recipes/feed`

Can also take `limit` and `offset` query parameters like List Recipes

Authentication required, will return multiple recipes created by followed users, ordered by most recent first.

### Get Recipe

`GET /api/recipes/:slug`

No authentication required, will return single recipe

### Create Recipe

`POST /api/recipes`

Example request body:

```source-json
{
  "title": "How to train your dragon",
  "description": "Ever wonder how?",
  "body": "You have to believe",
  "tagList": ["reactjs", "angularjs", "dragons"]
}
```

Authentication required, will return a Recipe

Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings

### Update Recipe

`PUT /api/recipes/:slug`

Example request body:

```source-json
{
  "title": "Did you train your dragon?"
}
```

Authentication required, returns the updated Recipe

Optional fields: `title`, `description`, `body`

The `slug` also gets updated when the `title` is changed

### Delete Recipe

`DELETE /api/recipes/:slug`

Authentication required

### Add Comments to a Recipe

`POST /api/recipes/:slug/comments`

Example request body:

```source-json
{
  "body": "His name was my name too."
}
```

Authentication required, returns the created Comment
Required field: `body`

### Get Comments from a Recipe

`GET /api/recipes/:slug/comments`

Authentication optional, returns multiple comments

### Delete Comment

`DELETE /api/recipes/:slug/comments/:id`

Authentication required

### Favorite Recipe

`POST /api/recipes/:slug/favorite`

Authentication required, returns the Recipe
No additional parameters required

### Unfavorite Recipe

`DELETE /api/recipes/:slug/favorite`

Authentication required, returns the Recipe

No additional parameters required

### Get Tags

`GET /api/tags`
