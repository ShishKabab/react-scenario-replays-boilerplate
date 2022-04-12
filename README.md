# Scenario replays with React + Typescript boilerplate

This boilerplate demonstrates a simplified implementation of [scenario replays](https://www.vdenboer.com/blog/scenario-replays). Scenario replays are like automated tests that instead of just giving a checkmark allow you to:

- jump to any point in any of the scenarios.
- block requests until you unblock them and sabotage requests so they error out.
- browse all scenarios in the product as design documentation that can never be out of sync.
- record scenarios from user actions that you can send around **not implemented here yet**

This in turn allows you to:

- quickly jump to the place in your product that you want to modify, saving setup costs to start working on a new task.
- offload styling work to less/differently specialized people (such as designers) by pointing them to the scenario they have to style, only requiring them to write CSS.
- have a standard way of visualizing and working on loading and error state, keeping them visible in the design docs whereas they often get neglected.
- browse through all the workflows to see whether there's any styling issues.
- see how restyling efforts impact all areas of the product.
- have non-technical people record scenarios for attaching bug reports and making sure they get included in automated test suites.
- deploy test versions with scenario replays and the overview UI, so you can easily show what new versions look like without any local setup.

Although this sounds like end-to-end browser testing, you get:

- all the advantages listed above, whereas browser tests give you success/failure and maybe some screenshots
- a much faster and smoother experience all running in the browser. Just go to the URL of a specific scenario and you're there in miliseconds.
- tests that execute user actions not based on CSS selectors, but on deeper understanding of your program so tests don't break depending on your CSS.

That said, you can build browser testing on top of scenario replays by spinning up browsers pointing to scenario replays and seeing whether results are still as expected.

## Getting started

Clone out this repository and run `npm install`/`yarn`. Run the development server and back-end with `npm start` (or `yarn start`) You can then go to:

- the overview UI of all scenarios on a specific page: http://localhost:3000/?meta=true&scenario=auth
- the overview UI of a specific scenario on a specific page: http://localhost:3000/?meta=true&scenario=auth.login%2Fsuccess
- a scenario at a specific step: http://localhost:3000/?scenario=auth.login%2Fsuccess.password (entered password, but just before submitting)
- the end result of a specific scenario: - a scenario at a specific step: http://localhost:3000/?scenario=auth.login%2Fsuccess

## How it works

This example works with stateful React class components with decorators to mark components and their methods available for use in scenario replays and recording. You can see the `scenarioComponent()` and `scenarioMethod()` decorators being used [here](./src/features/auth/pages/auth.tsx). The `@scenarioComponent()` decorator wraps the component and registers and deregisters it with the central [ComponentRegistry](./src/feature)

## Current state

What is implemented:

- [x] A type-safe way of specifying which React components and methods their can be used in scenario replays
- [x] Description of scenarios in easy-to-read code allowing you to navigate routes, wait for components, call their methods and wait for signals
- [x] Jumping to specifc steps in scenarios
- [x] Blocking and sabotaging specific back-end requests to reproduce loading and error states
- [x] An overview UI allowing you to browse all scenarios in the program

What is not implemented yet:

- [ ] Styling of the main program and overview UI
- [ ] Overview UI of all workflows in the program, instead of only specific parts by URL (small fix)
- [ ] Data-driven scenario replays that can be recorded from user interactions
- [ ] Fixture generation, saving and loading
- [ ] Links from overview UI to specific scenarios and scenario steps
- [ ] Making overview UI play nice with media queries
- [ ] Running the entire back-end in browser to eliminate need of starting seperate back-end during development
- [ ] Using scenarios in combination with end-to-end browser tests
- [ ] Nicer scenario and step descriptions
- [ ] Embedding scenarios in user-facing documentation so you can you product documentation with always up-to-date screenshots
