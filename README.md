# Welcome to the Audition

Here at Spacely's Sprockets, we're processing applications for new employees. In order to process them efficiently we need your help.

You'll find a server in this repo that you can start using `npm run server`. But before you do that, you should seed some initial application data using `npm run server:seed`. That'll make sure you have 20 applications to start playing around with;

## The Setup

You have an API that gives back a list of applications in various states.

Our application state flow is:
draft -> published -> reviewed -> accepted | rejected

Note: An editor can only leave reviews if the appliction is in "published" state.

There are several mutations for advancing an application between states as well as for leaving reviews (an application can have many reviews).

## The Challenge

We need you to build a ReactJS app that does 2 things:

- Has an Application view and show it's state and any reviews that were left for that application
- Has an Editor view that allows you to leave `reviews` for an Application (if the Application is in the right state) and advance the Application to `Accepted` or `Rejected`

## The Requirements

- You should implement this solution using React and Typescript
