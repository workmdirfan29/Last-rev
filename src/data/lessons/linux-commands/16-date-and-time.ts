import { defineLesson } from "@/data/lessons/author"

export default defineLesson("linux-commands", {
  slug: "date-and-time",
  title: "Working with date and time",
  topic: "Date & time",
  minutes: 18,
  overview:
    "Print the current date, format it with +'%d-%m-%Y' style patterns and calculate relative dates such as tomorrow or two years ago.",
  objectives: [
    "Print the current date and time",
    "Format output with date +'format'",
    "Compute relative dates with --date",
    "Use fixed dates for repeatable scripts",
  ],
  prerequisites: ["lesson.linux-commands.pipes-and-redirection"],
  sections: [
    {
      kind: "explain",
      heading: "The date command",
      body: [
        "`date` with no arguments prints the current date and time of the system. After a `+`, you can give a **format** made of percent codes: `%d` day, `%m` month, `%Y` four-digit year, `%H` hour, `%M` minute, `%S` second, `%F` the full date as `YYYY-MM-DD`, `%T` the time as `HH:MM:SS`, `%A` weekday name and `%B` month name.",
        '`date --date "text"` (or `-d`) does not use the current time but the one you describe. The text can be an absolute date, or a relative expression such as `tomorrow`, `yesterday`, `2 years ago`, `5 sec ago` or `3 weeks`. With a fixed starting date the result is always the same, which is useful for testing.',
      ],
    },
    {
      kind: "code",
      heading: "Formats and offsets",
      example: {
        title: "A fixed date as a base",
        language: "bash",
        code: 'date -d "2020-12-15 10:30:00" +"%d-%m-%Y"\ndate -d "2020-12-15 10:30:00" +"%Y/%m/%d %H:%M:%S"\ndate -d "2020-12-15" +"%A %B %-d"\ndate -d "2020-12-15 +1 day" +%F\ndate -d "2020-12-15 -1 day" +%F\ndate -d "2020-12-15 2 years ago" +%F\ndate -d "2020-12-15 10:30:00 5 sec ago" +%T\ndate -d "2020-12-15 3 weeks" +%F\ndate -u -d @0 +"%F %T"',
        walkthrough: [
          "`%d-%m-%Y` prints `15-12-2020`; `%Y/%m/%d %H:%M:%S` prints `2020/12/15 10:30:00`. `%A %B %-d` prints the names `Tuesday December 15` (the `-` removes zero padding).",
          "`+1 day` and `-1 day` give `2020-12-16` and `2020-12-14`; `2 years ago` gives `2018-12-15`; `3 weeks` gives `2021-01-05`.",
          "`5 sec ago` moves back five seconds: `10:29:55`.",
          "`@0` means seconds since the Unix epoch, and `-u` uses UTC, so the result is `1970-01-01 00:00:00`. `%s` prints seconds since the epoch.",
          'With no fixed date, `date -d tomorrow` and `date -d "next tue"` are relative to the current moment, so the result changes every day.',
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Common format codes",
      diagram: {
        kind: "table",
        title: "Percent codes",
        headers: ["Code", "Meaning", "Example"],
        rows: [
          ["%d", "Day of month", "15"],
          ["%m", "Month number", "12"],
          ["%Y", "Four-digit year", "2020"],
          ["%H:%M:%S", "Time", "10:30:00"],
          ["%F", "Date as YYYY-MM-DD", "2020-12-15"],
          ["%s", "Seconds since 1970-01-01 UTC", "1608028200"],
        ],
      },
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Forgetting the + before the format.",
          fix: "date +%F works; date %F is an error.",
        },
        {
          mistake: "Mixing up %m (month) and %M (minutes).",
          fix: "Month is lowercase m, minutes uppercase M.",
        },
        {
          mistake: "Relying on the local time zone in scripts.",
          fix: "Use -u or set TZ to avoid surprises.",
        },
        {
          mistake:
            "Using date +%d-%m-%Y in file names without thinking about sorting.",
          fix: "Use %F (YYYY-MM-DD) so names sort in date order.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "A dated backup name",
      scenario: "You want daily backup files that sort correctly.",
      body: [
        "`tar -czf backup-$(date +%F).tar.gz data/` creates `backup-2020-12-15.tar.gz`. The command substitution `$(...)` runs date and inserts its output into the name.",
        'To delete backups older than 30 days, relative-date arithmetic like `date -d "30 days ago" +%F` gives the cut-off date.',
      ],
    },
  ],
  check: [
    {
      type: "output",
      id: "date-format",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'date -d "2020-12-15" +"%d-%m-%Y"',
      },
      options: ["15-12-2020", "2020-12-15", "12-15-2020"],
      answer: 0,
      explanation: "%d-%m-%Y prints day, month, then year.",
    },
    {
      type: "output",
      id: "date-offset",
      prompt: "What does this print?",
      code: {
        language: "bash",
        code: 'date -d "2020-12-15 +1 day" +%F',
      },
      options: ["2020-12-16", "2020-12-14", "2020-12-15"],
      answer: 0,
      explanation: "+1 day moves one day forward.",
    },
    {
      type: "single",
      id: "minute-vs-month",
      prompt: "In a date format, what is %M?",
      options: ["Minutes", "Month", "Milliseconds"],
      answer: 0,
      explanation: "%m is the month; %M is the minute.",
    },
    {
      type: "blank",
      id: "plus-sign",
      prompt: "A date format must start with a ___ sign: date +%F.",
      answer: "+",
      explanation: "The format argument is introduced by a plus sign.",
      accepted: ["plus"],
    },
  ],
  assignment: {
    title: "Date formats",
    task: [
      "Print today's date in three different formats, including one that sorts well in file names.",
      "Using a fixed base date, compute the date tomorrow, yesterday, two years ago and in three weeks, and print the weekday name of each.",
    ],
    checklist: [
      "Three formats of the current date were printed",
      "A fixed base date made results repeatable",
      "Relative offsets were used",
      "%F was used for sortable names",
    ],
    hints: ['Use date -d "YYYY-MM-DD +N days".'],
    minutes: 10,
  },
  exercises: [
    {
      slug: "date-recipes",
      title: "Pick the command",
      task: [
        "Write commands to: (1) print the current date as DD/MM/YYYY; (2) print the date of seven days ago as YYYY-MM-DD; (3) print the current time as HH:MM:SS.",
      ],
      language: "bash",
      starter: "# 1\n# 2\n# 3",
      solution: 'date +"%d/%m/%Y"\ndate -d "7 days ago" +%F\ndate +%T',
      hints: ["Relative dates use -d."],
      checklist: [
        "The format uses +",
        "7 days ago uses -d",
        "%T prints the time",
      ],
    },
  ],
  revisionNotes: [
    "date prints the current time; +format controls the output",
    "%d %m %Y %H %M %S %F %T %A %B %s",
    'date -d "offset": tomorrow, yesterday, 2 years ago, 5 sec ago',
    "Use %F and UTC for scripts",
  ],
  resources: [
    {
      label: "date(1) manual page",
      url: "https://man7.org/linux/man-pages/man1/date.1.html",
    },
    {
      label: "GNU date invocation",
      url: "https://www.gnu.org/software/coreutils/manual/html_node/date-invocation.html",
    },
  ],
})
