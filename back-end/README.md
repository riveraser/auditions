# Engineering Audition

Spacely's Sprockets is building the future of Electric Vehicles! We're including sensors all over our vehicles to make sure they perform at their best all the time! These sensors sample different aspects of the car to ensure everything is within expectations.

Today, we're shipping 3 different sensors with our vehicles - loudness, bumpiness, and happiness. Each sensor logs values for each vehicle continuously and stores that information in a log for that vehicle. At the end of each day, all the vehicles upload their logs to one server (yeah, inefficient huh) for processing.

Your job is to parse all these logs and detect any anomalies for any vehicles so we can flag them for service.

## Detector Characteristics

Each detector has different thresholds above which your program needs to flag for service. The detectors that exist today are:

### Loudness

- name: loudness
- threshold: standard deviation < 2
- values: float

### Bumpiness

- name: bumpiness
- threshold: average > 1.5 times BASE
- base: specified as a runtime parameter
- values: float

### Happiness

- name: happiness
- threshold: sum > 1.2x BASE
- base: specified as a runtime parameter
- values: float

## Log File Characteristics

An example log looks like the following.

The first line contains baseline values for each detector in the format `reference <detector-type> <value> <detector-type> <value>`

For example:
reference loudness 10 happiness 5 bumpiness 10

After that, each line contains either a heading for a specific detector in the format of `<detector-type> <name as uuid>`

For example:
loudness 184744bf-6439-4c9b-aeba-42e8fb6a214d

Finally, below each detector's heading, you can find one or more samples from that detector in the following format: `<time> <value>`

For example:
2020-01-01T01:00 100

Sample Input Log
reference loudness 5 bumpiness 10 happiness 5
loudness 184744bf-6439-4c9b-aeba-42e8fb6a214d
2007-04-05T22:00 3
2007-04-05T22:01 2
loudiness f8aa668d-96b6-4f64-8179-505fa291ebd3
2007-04-05T22:00 8
2007-04-05T22:01 6
happiness 184744bf-6439-4c9b-aeba-42e8fb6a214d
2007-04-05T22:00 1
2007-04-05T22:01 2
happiness f8aa668d-96b6-4f64-8179-505fa291ebd3
2007-04-05T22:00 7
2007-04-05T22:01 9
bumpiness f8aa668d-96b6-4f64-8179-505fa291ebd3
2007-04-05T22:00 7
2007-04-05T22:01 9

Sample Output
{
"f8aa668d-96b6-4f64-8179-505fa291ebd3": ["loudness"],
"184744bf-6439-4c9b-aeba-42e8fb6a214d": ["happiness"]
}

You have been tasked with creating a solution that takes the contents of a log file, and outputs the devices and their classification, as per the sample output above.

## The Solution

You should solve this problem in Typescript.

Create a Typescript library that exports the following function:
export evaluate(filename: string): { }

The parameter filename will simply be the path to a local file that contains the aggregated logs.

You can assume you are submitting a PR for a feature that will go into production. You may use any library or tool available to you to solve this task.

You will own this process and will be responsible for future expansions to the code. You should solve the problem as described but you are encouraged to be forward-thinking and advocate for any changes or demonstrate any practices that would improve the process (such as a change in log format, a change in the class interface, etc.). While the sample log file is small, production log files are likely to be very large, and Spacely's Sprockets will be adding more sensor types (for example, a noise level detector) in the future.

## Testing

We've set up a small test harness you can use - just run `npm test` and see how you do!
