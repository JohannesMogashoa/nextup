# Welcome to your Convex + Next.js + Clerk app

After the initial setup you'll have a working full-stack app using:

-   Convex as your backend (database, server logic)
-   [Next.js](https://nextjs.org/) as your main application handling most user interaction
-   [Tailwind](https://tailwindcss.com/) for building great looking accessible UI
-   [shadcn](https://ui.shadcn.com/) as the foundation for you design system
-   [Clerk](https://clerk.com/) for authentication
-   [T3 Env](https://env.t3.gg/docs/introduction) as your type-safe validator for environment variables

## Get started

If you just cloned this codebase run:

```
pnpm install
pnpm run dev
```

or

```
npm install
npm run dev
```

Feel free to copy over the contents of `.env.example` to see what values are needed in order for everything to run smoothly.
There is a hard link between your `.env` file and the `env.ts` file so ensure that they are always in sync 😁

Then:

1. Open your app. There should be a "Claim your application" button from Clerk in the bottom right of your app.
2. Follow the steps to claim your application and link it to this app.
3. Follow step 3 in the [Convex Clerk onboarding guide](https://docs.convex.dev/auth/clerk#get-started) to create a Convex JWT template.
4. Uncomment the Clerk provider in `convex/auth.config.ts`
5. Paste the Issuer URL as `CLERK_JWT_ISSUER_DOMAIN` to your dev deployment environment variable settings on the Convex dashboard (see [docs](https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances))
6. Go back to Clerk and configure a new webhook which will be using your convex url `https://{cool-name-stuff}.convex.site`
    1. Note that you will be using the url with SITE in it and not CLOUD
    2. Then you add the webhook endpoind defined in `convex/http.ts` i.e. `clerk-webhook`
    3. This file can be modified to include the webhook secret check if you want to. See the commented lines
    4. Copy the Signing Secret (something like whsec_aB1cD2/eF3gH4...) into an environment variable called CLERK_WEBHOOK_SECRET in the Convex dashboard settings for your instance.
7. To test that everything has been hooked up properly, you can start your application and create a new user. The new user should now appear in your convex database for the project.

## Learn more

To learn more about developing your project with Convex, check out:

-   The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
-   The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
-   [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.
