# suits-inversify-bug
This repository aims to easily reproduce suits TestBed bug with `sociable` mocking. Run `yarn jest` to reproduce thee following error:

```shell
Suites Warning: Unreachable Exposed Dependency Detected.
The dependency 'UserApi' has been exposed but cannot be reached within the current testing context.
This typically occurs because 'UserApi' is not a direct dependency of the unit under test (UserService) nor any
of its other exposed dependencies. Exposing 'UserApi' without it being accessible from the unit under test or
its dependencies may lead to incorrect test configurations. To resolve this, please review and adjust your testing
setup to ensure all necessary dependencies are interconnected. Alternatively, if 'UserApi' does not influence
the unit under test, consider removing its exposure from your test setup.
For detailed instructions and best practices, refer to our documentation: https://suites.dev/docs.
```

Note that `ts-node index.ts` command works fine, while there is the same `sociable` mock and classes hierarchy.
