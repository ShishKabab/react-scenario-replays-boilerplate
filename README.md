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

- the overview UI of all scenarios in the entire program: http://localhost:3000/?meta=true
- the overview UI of all scenarios on a specific page: http://localhost:3000/?meta=true&scenario=auth
- the overview UI of a specific scenario on a specific page: http://localhost:3000/?meta=true&scenario=auth.login%2Fsuccess
- a scenario at a specific step: http://localhost:3000/?scenario=auth.login%2Fsuccess.password (entered password, but just before submitting)
- the end result of a specific scenario: - a scenario at a specific step: http://localhost:3000/?scenario=auth.login%2Fsuccess

## How it works

This example works with stateful React class components with decorators to mark components and their methods available for use in scenario replays and recording. You can see the `scenarioComponent()` and `scenarioMethod()` decorators being used [here](./src/features/auth/pages/auth.tsx). The `@scenarioComponent()` decorator wraps the component and registers and deregisters it with the central [ComponentRegistry](./src/features/scenario-replays/component-registry.ts) (passed down into the application through the React [ScenarioContext](./src/features/scenario-replays/react-context.tsx)) which is used by scenarios to wait for components and call their methods.

When we open the browser on any page, [we check](./src/setup/main.tsx) whether we have a `?scenario=something` part of the URL. If so, we find the right scenario file, pick the specific scenario from it and [start replaying it](./src/features/scenario-replays/replay.ts). A scenario file looks like [this](./src/scenarios/auth.ts). Every scenario returns a bunch of steps which use the context passed to them to navigate to different routes, call component methods, wait for signals emitted by components and block/sabotage/restore specific backend paths.

Signals are emitted by using the `emitSignal(component: React.Component, signal: Signal)` function and have a name and selector. They're used to indicate events like a page having loaded or saved some data. The selector is so you can filter for specific signals in scenarios, like `context.waitForSignal("TodoListPage", {}, { name: 'taskState', selector: { key: 'loadState', taskState: 'done' } })`.

Scenario assume that they're starting with an empty database. So the [backend](./backend/main.ts) is set up so that in development mode, clients can create their own isolated app with their own database and session states. When front-end starts, it first creates an app, remembers its ID and send that with each subsequent request as the header `X-Application-ID`. Sessions need to be isolated even in the same program if we want to run the overview UI, session IDs are transmitted through the `X-Session-ID` header instead of cookies. We want to enable scenarios to block/sabotage specifc backend requests, so there's a wrapper of the normal backend requester called the `BackendGate` which allows for exactly that. All this is implemented [here](./src/backend.ts).

When [we detect](./src/main.ts) `?meta=true` in the URL, we don't set up the program as normal, but start [the meta program](./src/setup/meta.tsx). This is another React application that creates mount points for each step in each scenario we want to show in the overview UI. Then it starts the main program for each step with its own mountpoint and own scenario and step it needs to display. Each main program then works as normal, creating its backend app and replaying its scenario until the step its supposed to display.

## Current state

What is implemented:

- [x] A type-safe way of specifying which React components and methods their can be used in scenario replays
- [x] Description of scenarios in easy-to-read code allowing you to navigate routes, wait for components, call their methods and wait for signals
- [x] Jumping to specifc steps in scenarios
- [x] Blocking and sabotaging specific back-end requests to reproduce loading and error states
- [x] An overview UI allowing you to browse all scenarios in the program

What is not implemented yet:

- [ ] Styling of the main program and overview UI
- [ ] Data-driven scenario replays that can be recorded from user interactions
- [ ] Fixture generation, saving and loading
- [ ] Making overview UI play nice with media queries
- [ ] Running the entire back-end in browser to eliminate need of starting seperate back-end during development
- [ ] Using scenarios in combination with end-to-end browser tests
- [ ] Nicer scenario and step descriptions
- [ ] Embedding scenarios in user-facing documentation so you can you product documentation with always up-to-date screenshots
- [ ] Make scenarios lazy load
- [ ] Factor out scenario replay utilities into separate package
