import { defineLesson } from "@/data/lessons/author"

export default defineLesson("git", {
  slug: "bitbucket-repositories-and-permissions",
  title: "Bitbucket repositories and permissions",
  topic: "Bitbucket repositories & permissions",
  minutes: 30,
  overview:
    "Create a Bitbucket Cloud repository, clone it, and control who can do what with the Admin, Write and Read repository permissions and with branch permissions.",
  objectives: [
    "Create a repository, clone it and push the first commit",
    "Explain the Admin, Write and Read repository permissions",
    "Restrict who can write to or merge into a branch with branch permissions",
    "Apply least privilege when granting access",
  ],
  prerequisites: ["lesson.git.workflows"],
  sections: [
    {
      kind: "explain",
      heading: "A central repository",
      body: [
        "Bitbucket Cloud hosts Git repositories. A repository you create there starts empty and becomes the **central repository** for your files: others can reach it if you give them permission. You then clone it to your computer, work locally and push your commits back.",
        "When you create a repository you choose its name and its access level. The name appears in the repository URL. Repositories are private by default, which means only people you grant access to can see them. You can change these settings later.",
      ],
    },
    {
      kind: "code",
      heading: "Create and clone",
      example: {
        title: "First push",
        language: "bash",
        code: "git clone https://bitbucket.org/WORKSPACE/REPOSITORY.git\ncd REPOSITORY\necho \"# My project\" > README.md\ngit add README.md\ngit commit -m \"Add README\"\ngit push origin main",
        walkthrough: [
          "Create the repository on the website first, then copy its clone URL.",
          "`git clone` makes a local copy and sets `origin` to the Bitbucket repository.",
          "Commit locally, then `git push origin main` sends the commit to Bitbucket.",
        ],
      },
    },
    {
      kind: "diagram",
      heading: "Repository permissions",
      diagram: {
        kind: "table",
        title: "What each permission level allows",
        headers: ["Level", "Allows"],
        rows: [
          ["Admin", "Everything in the repository: change settings, update user permissions and delete the repository"],
          ["Write", "Contribute by pushing changes directly"],
          ["Read", "View, clone and fork the repository code, but not push changes"],
        ],
      },
    },
    {
      kind: "explain",
      heading: "Branch permissions",
      body: [
        "Repository permissions apply to the whole repository. **Branch permissions** let you add rules for particular branches, such as restricting **write access** (who may push directly) and **merge access via pull requests** (who may merge).",
        "You can target a branch by **name**, by a **pattern** using a wildcard such as `release-*`, or, if the branching model is enabled, by **branch type**. Be careful with overlapping rules, because a branch can match more than one.",
        "**Merge checks** go further: they recommend or require conditions, such as approvals or passing builds, before a merge.",
        "Grant the least access that lets someone do their job. Most contributors need Write, only a few people need Admin, and readers need only Read.",
      ],
    },
    {
      kind: "mistakes",
      heading: "Common mistakes",
      items: [
        {
          mistake: "Giving everyone Admin to avoid permission errors.",
          fix: "Grant the lowest level needed; reserve Admin for a few owners.",
        },
        {
          mistake: "Leaving the main branch open to direct pushes.",
          fix: "Restrict write access on main and require merging through pull requests.",
        },
        {
          mistake: "Overlapping branch rules that contradict each other.",
          fix: "Review the rules together and keep patterns simple.",
        },
        {
          mistake: "Forgetting to remove access when someone leaves the team.",
          fix: "Review the access list regularly.",
        },
      ],
    },
    {
      kind: "practical",
      heading: "Protecting the main branch",
      scenario:
        "A team of five shares a repository, and one person should be able to merge into main.",
      body: [
        "Give the team Write access on the repository. Add a branch restriction for `main` so that only a chosen lead has merge access via pull requests, and add a merge check that requires an approval.",
        "Contributors push feature branches and open pull requests; only the lead merges them.",
      ],
    },
  ],
  check: [
    {
      type: "single",
      id: "read-permission",
      prompt: "What can someone with only Read permission do?",
      options: [
        "View, clone and fork the code, but not push",
        "Push directly to any branch",
        "Delete the repository",
      ],
      answer: 0,
      explanation:
        "Read allows viewing, cloning and forking but not pushing changes.",
    },
    {
      type: "single",
      id: "admin-permission",
      prompt: "Which level can change repository settings and user permissions?",
      options: ["Admin", "Write", "Read"],
      answer: 0,
      explanation:
        "Admin allows everything within the repository, including permissions and deletion.",
    },
    {
      type: "truefalse",
      id: "branch-pattern",
      statement: "A branch permission can target branches by name or by a wildcard pattern.",
      answer: true,
      explanation:
        "For example, a pattern ending in * matches every branch with that prefix.",
    },
    {
      type: "blank",
      id: "least-privilege",
      prompt: "Granting only the access a person needs follows the principle of least ___.",
      answer: "privilege",
      explanation:
        "Least privilege reduces the damage a mistake or a compromised account can cause.",
    },
  ],
  assignment: {
    title: "Set up a protected repository",
    task: [
      "Create a private repository on Bitbucket Cloud, clone it and push a first commit.",
      "Add a branch restriction on main that allows merging only through pull requests, and write down which permission level each of three imaginary teammates would get and why.",
    ],
    checklist: [
      "The repository is private and cloned locally",
      "The first commit reached Bitbucket",
      "The branch restriction is in place for main",
      "Each teammate has the lowest sufficient level",
    ],
    hints: ["Read the repository's settings pages for user access and branch restrictions."],
    minutes: 15,
  },
  exercises: [
    {
      slug: "choose-permission",
      title: "Pick the permission",
      task: [
        "For each person, write Admin, Write or Read: (1) a developer who pushes branches; (2) an auditor who only reads code; (3) the owner who manages access.",
      ],
      language: "markdown",
      starter: "1. \n2. \n3. ",
      solution: "1. Write\n2. Read\n3. Admin",
      hints: ["Choose the lowest level that still lets each person do their job."],
      checklist: [
        "The developer has Write",
        "The auditor has Read",
        "The owner has Admin",
      ],
    },
  ],
  revisionNotes: [
    "Create the repository, clone it, push; private by default",
    "Admin: everything; Write: push; Read: view, clone and fork",
    "Branch permissions: write access and merge via pull requests by name, pattern or type",
    "Merge checks add required conditions; apply least privilege",
  ],
  resources: [
    {
      label: "Create a Git repository",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/create-a-git-repository/",
    },
    {
      label: "Grant repository access to users and groups",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/grant-repository-access-to-users-and-groups/",
    },
    {
      label: "Use branch permissions",
      url: "https://support.atlassian.com/bitbucket-cloud/docs/use-branch-permissions/",
    },
  ],
})
