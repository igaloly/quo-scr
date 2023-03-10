import { Actor } from "apify";
import { BasicCrawler } from "crawlee";
import { PAGINATION_PARAMS } from "./constants/api.js";
// import { ERROR_MESSAGES } from "./constants/error_messages.js";
import { constructGraphQLRequest, getAllExistingQuestions } from "./helpers/index.js";
import { router } from "./routes.js";
// import { answerStore } from "./stores/answers_store.js";
// import { Input } from "./types/input.js";
import { nonConfigurableQueryArguments } from "./types/query_arguments.js";
import { QueryType } from "./types/query_types.js";

const queries = ['why', 'what', 'how', 'should', 'have', 'I', 'he', 'you', 'do', 'his', 'we', 'say', 'her', 'she', 'my', 'one', 'all', 'would', 'what', 'so', 'up', 'out', 'who', 'get', 'which', 'go', 'when', 'make', 'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people', 'year', 'your', 'good', 'some', 'could', 'see', 'other', 'now', 'look', 'only', 'come', 'over', 'think', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'give', 'day', 'most', 'us']

// GC error..... do it manually \ change inplementation
for(const query of queries) {
    console.log('Querying', query)
    // Initialize the Apify SDK
    // await Actor.init();

    // const input = await Actor.getInput<Input>();
    // if (!input) {
    //     throw new Error(ERROR_MESSAGES.INPUT_EMPTY);
    // }

    // const { query, proxy, maxAgeSecs, maxPoolSize, maxUsageCount } = input;
    // const proxy = null
    const maxAgeSecs = 999999999
    const maxPoolSize = 10
    const maxUsageCount = 200

    // export const proxyConfiguration = await Actor.createProxyConfiguration(proxy ?? {
    //     useApifyProxy: false
    // });

    router.questionFileNames = getAllExistingQuestions()

    const crawler = new BasicCrawler({
        requestHandler: router,
        // use multiple sessions to enable quick concurrent scraping
        // without getting noticed by Quora's rate limiting
        useSessionPool: true,
        sessionPoolOptions: {
            // the following options are those that have been tested multiple times to work;
            // if this actor gets traction, you might enable their customization;

            // several sessions have proved to be enough
            // too few sessions might slow down the crawl or fall under rate limiting
            maxPoolSize,
            sessionOptions: {
                // a single session is able to last indefinitely without getting blocked
                maxAgeSecs,
                // just as a precaution, however, let's change a session after 100 requests so as not to
                // arouse suspicion
                maxUsageCount,
            },
        },
    });

    // await answerStore.initialize();

    await crawler.run([
        constructGraphQLRequest(QueryType.SEARCH, {
            after: "0",
            first: PAGINATION_PARAMS.PAGINATION_BATCH,
            query,
            ...nonConfigurableQueryArguments[QueryType.SEARCH],
        }),
    ]);

    // Exit successfully
    // await Actor.exit();
}