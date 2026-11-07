import { defineQuestions } from "../author"
import { q } from "../compact"

const A = "https://docs.aws.amazon.com"
const IAM = `${A}/IAM/latest/UserGuide`
const S3 = `${A}/AmazonS3/latest/userguide`
const EC2 = `${A}/AWSEC2/latest/UserGuide`
const RDS = `${A}/AmazonRDS/latest/UserGuide`
const WP = `${A}/whitepapers/latest`

export default defineQuestions("aws", "fresher", [
  q({
    slug: "cloud-computing-benefits-aws",
    topic: "Cloud concepts & regions",
    d: "easy",
    title: "What is cloud computing and what advantages does it give?",
    kw: [
      "cloud computing",
      "pay as you go",
      "economies of scale",
      "elasticity",
      "aws",
    ],
    intent:
      "A foundation question: checks you can explain why teams use the cloud.",
    short:
      "Cloud computing is renting IT resources such as servers, storage and databases over the internet and paying only for what you use, instead of buying and running your own hardware. AWS describes advantages such as trading upfront fixed costs for variable costs, benefiting from massive economies of scale, no longer guessing capacity because you can scale up and down on demand, and being able to deploy globally in minutes. You still manage how you use the services, including security settings.",
    detail: [
      "Services are available on demand through the console, command line or APIs.",
      "Capacity can follow demand, instead of being sized for the peak.",
      "The provider runs the physical data centres.",
    ],
    ex: "A start-up launches servers for a campaign, scales them for the traffic spike and turns them off afterwards, paying only for the hours used.",
    mistakes: [
      "Leaving unused resources running and paying for them.",
      "Assuming the provider secures everything for you.",
    ],
    follow: ["What does elasticity mean?"],
    points: [
      "Rent resources on demand",
      "Pay for what you use",
      "Scale up and down",
      "Provider runs the hardware, you configure the services",
    ],
    notes: ["Variable cost instead of upfront cost."],
    src: [
      [
        "AWS: Six advantages of cloud computing",
        `${WP}/aws-overview/six-advantages-of-cloud-computing.html`,
      ],
      [
        "AWS: Types of cloud computing",
        `${WP}/aws-overview/types-of-cloud-computing.html`,
      ],
    ],
  }),
  q({
    slug: "regions-and-availability-zones",
    topic: "Cloud concepts & regions",
    d: "easy",
    title: "What are AWS Regions and Availability Zones?",
    kw: [
      "region",
      "availability zone",
      "high availability",
      "latency",
      "data residency",
    ],
    intent: "Checks you understand the geography you design for.",
    short:
      "An AWS Region is a separate geographic area, and each Region is made of multiple Availability Zones (AZs), which are isolated locations within the Region. Resources are created in a specific Region, and you choose it for lower latency to your users, legal requirements about where data lives, available services and cost. Spreading an application across more than one AZ keeps it running if one AZ has a problem, which is the basis of high availability within a Region.",
    detail: [
      "Most resources, such as EC2 instances and S3 buckets, are tied to one Region; some services are global.",
      "Data does not leave a Region unless you configure it to.",
      "Check the Region selected in the console before creating resources.",
    ],
    ex: "An application for Indian users runs in the Mumbai Region across two Availability Zones.",
    mistakes: [
      "Creating resources in the wrong Region and not finding them.",
      "Running everything in a single AZ.",
    ],
    follow: ["Why use more than one AZ?"],
    points: [
      "Region = geographic area",
      "AZs = isolated locations in a Region",
      "Choose by latency, compliance, services, cost",
      "Multi-AZ for availability",
    ],
    notes: ["Region first, then AZs."],
    src: [
      [
        "AWS: Regions and Zones (EC2)",
        `${EC2}/using-regions-availability-zones.html`,
      ],
    ],
  }),
  q({
    slug: "shared-responsibility-model",
    topic: "Cloud concepts & regions",
    d: "easy",
    title: "What is the AWS shared responsibility model?",
    kw: [
      "shared responsibility",
      "security of the cloud",
      "security in the cloud",
      "customer responsibility",
      "compliance",
    ],
    intent: "Checks you know which security tasks are yours.",
    short:
      "Under the shared responsibility model, AWS is responsible for the security of the cloud: the physical facilities, hardware and the infrastructure that runs its services. The customer is responsible for security in the cloud: how they configure and use the services, including identity and access management, data classification and encryption, operating system patching on virtual servers they manage, network and firewall rules such as security groups, and application security. The split depends on the service type: the more managed the service, the more AWS handles.",
    detail: [
      "With EC2 you patch the guest operating system; with a managed database AWS handles more of it.",
      "Misconfigured storage permissions are a customer-side issue.",
      "Compliance programmes also have shared parts.",
    ],
    ex: "AWS secures the data centre, but a public S3 bucket created by mistake is the customer's responsibility.",
    mistakes: [
      "Assuming AWS patches your EC2 operating system.",
      "Leaving buckets or ports open to the world.",
    ],
    follow: ["Who patches the OS of an EC2 instance?"],
    points: [
      "AWS: security of the cloud",
      "Customer: security in the cloud",
      "Depends on the service type",
      "Configuration mistakes are yours",
    ],
    notes: ["They secure the cloud; you secure what you put in it."],
    src: [
      [
        "AWS: Shared responsibility model",
        `${WP}/aws-risk-and-compliance/shared-responsibility-model.html`,
      ],
    ],
  }),
  q({
    slug: "iam-what-is-and-components",
    topic: "IAM",
    d: "easy",
    title: "What is AWS IAM and what are users, groups, roles and policies?",
    kw: ["iam", "users", "groups", "roles", "policies"],
    intent:
      "A core AWS question: checks you know the identity building blocks.",
    short:
      "AWS Identity and Access Management (IAM) controls who can do what in your AWS account. An IAM user represents a person or application with long-term credentials, a group is a collection of users so permissions can be attached once to many, and a role is an identity with permissions that can be assumed temporarily by users, applications or AWS services. Permissions are defined in policies, JSON documents that allow or deny actions on resources, and are attached to users, groups or roles.",
    detail: [
      "Authentication proves who you are; policies decide what you may do.",
      "IAM is global and free to use.",
      "Roles give temporary credentials, which is preferable to long-lived access keys.",
    ],
    ex: "Developers are in a `Developers` group with a policy allowing them to read logs, while an EC2 instance uses a role to read from S3.",
    mistakes: [
      "Giving individual users permissions instead of using groups.",
      "Sharing one user between people.",
    ],
    follow: ["How is a role different from a user?"],
    points: [
      "Users, groups, roles, policies",
      "Policies are JSON permission documents",
      "Roles provide temporary credentials",
      "Attach permissions to groups or roles",
    ],
    notes: ["Who you are, what you can do."],
    src: [
      ["AWS IAM: What is IAM?", `${IAM}/introduction.html`],
      ["AWS IAM: IAM roles", `${IAM}/id_roles.html`],
      ["AWS IAM: IAM user groups", `${IAM}/id_groups.html`],
    ],
  }),
  q({
    slug: "iam-policy-structure",
    topic: "IAM",
    d: "medium",
    title: "How is an IAM policy structured?",
    kw: ["iam policy", "effect", "action", "resource", "json policy"],
    intent: "Checks you can read a policy document.",
    short:
      "An IAM policy is a JSON document with one or more statements. Each statement has an `Effect` (`Allow` or `Deny`), the `Action` or actions it covers, such as `s3:GetObject`, and the `Resource` it applies to, identified by an ARN. Resource-based policies, such as an S3 bucket policy, also have a `Principal` saying who the statement applies to, and statements can include `Condition` elements to restrict when they apply. Policies grant exactly what they list, so write them as narrowly as the task allows.",
    detail: [
      "AWS managed policies are provided by AWS, and customer managed policies are ones you write.",
      "Inline policies are embedded directly in a single identity.",
      "The IAM policy simulator and Access Analyzer help check policies.",
    ],
    ex: "A policy lets one application read objects only from one bucket prefix.",
    code: [
      [
        "Read-only access to one bucket",
        "json",
        `{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": ["s3:GetObject"],\n      "Resource": "arn:aws:s3:::my-app-uploads/*"\n    }\n  ]\n}`,
        [
          "`Effect` allows the actions.",
          "`Action` lists the permitted API calls.",
          "`Resource` limits it to objects in one bucket.",
        ],
      ],
    ],
    mistakes: [
      'Using `"Action": "*"` and `"Resource": "*"`.',
      "Forgetting the object-level ARN with /*.",
    ],
    follow: ["What does Principal mean in a bucket policy?"],
    points: [
      "Statements with Effect, Action, Resource",
      "Principal in resource-based policies",
      "Conditions narrow access",
      "Be specific",
    ],
    notes: ["Effect, Action, Resource."],
    src: [
      [
        "AWS IAM: JSON policy element reference",
        `${IAM}/reference_policies_elements.html`,
      ],
      ["AWS IAM: Policies and permissions", `${IAM}/access_policies.html`],
    ],
  }),
  q({
    slug: "iam-evaluation-allow-deny",
    topic: "IAM",
    d: "medium",
    title: "How does AWS decide whether a request is allowed?",
    kw: [
      "policy evaluation",
      "explicit deny",
      "implicit deny",
      "least privilege",
      "permission boundary",
    ],
    intent: "Checks you know that deny wins and nothing is allowed by default.",
    short:
      "By default every request is denied, so access must be explicitly allowed by some policy. If an applicable policy allows the action, AWS allows the request, but an explicit `Deny` in any applicable policy overrides every allow. Other controls, such as permissions boundaries or organisation policies, can further limit the maximum permissions. So the effective permissions are what is allowed minus what is denied or out of bounds, and the safest approach is to start with nothing and add only the permissions needed.",
    detail: [
      "Identity-based and resource-based policies are evaluated together.",
      "Permissions boundaries set the maximum permissions an identity can have.",
      "Use explicit denies for guardrails that must never be bypassed.",
    ],
    ex: "A user has an allow for S3 but a separate explicit deny on deleting a protected bucket; the deletion is blocked.",
    mistakes: [
      "Expecting an allow to beat a deny.",
      "Starting with broad admin rights and trimming later.",
    ],
    follow: ["What is a permissions boundary?"],
    points: [
      "Default deny",
      "Explicit deny always wins",
      "Allow needs a policy",
      "Boundaries cap permissions",
    ],
    notes: ["Deny beats allow."],
    src: [
      [
        "AWS IAM: Policy evaluation logic",
        `${IAM}/reference_policies_evaluation-logic.html`,
      ],
      ["AWS IAM: Security best practices", `${IAM}/best-practices.html`],
    ],
  }),
  q({
    slug: "iam-root-user-and-mfa",
    topic: "IAM",
    d: "easy",
    title:
      "Why shouldn't you use the AWS root user day to day, and why enable MFA?",
    kw: [
      "root user",
      "mfa",
      "account security",
      "admin user",
      "iam best practices",
    ],
    intent: "Checks you protect the most powerful credential.",
    short:
      "The root user is the identity created with the AWS account and has complete access to all resources, with some actions that only it can do. Because compromise would be catastrophic, use it only for the few tasks that require it, protect it with a strong password and multi-factor authentication, and do everyday work with IAM identities that have limited permissions. AWS best practices also recommend requiring MFA for users, so a leaked password alone is not enough to access the account.",
    detail: [
      "Do not create access keys for the root user.",
      "Prefer federated or role-based access with temporary credentials for people.",
      "Review and remove unused users and credentials regularly.",
    ],
    ex: "After creating the account, the owner sets up MFA on root, creates an admin user for daily work and locks the root credentials away.",
    mistakes: ["Using root for everyday tasks.", "Creating root access keys."],
    follow: ["What is MFA?"],
    points: [
      "Root has unrestricted access",
      "Use it rarely, protect with MFA",
      "Daily work with IAM identities",
      "Require MFA for users",
    ],
    notes: ["Lock away root, use least-privilege users."],
    src: [
      ["AWS IAM: AWS account root user", `${IAM}/id_root-user.html`],
      [
        "AWS IAM: Multi-factor authentication",
        `${IAM}/id_credentials_mfa.html`,
      ],
    ],
  }),
  q({
    slug: "iam-roles-for-ec2-and-access-keys",
    topic: "IAM",
    d: "medium",
    title:
      "How should an application on EC2 get AWS permissions, and why avoid access keys?",
    kw: [
      "instance profile",
      "iam role ec2",
      "access keys",
      "temporary credentials",
      "hard-coded credentials",
    ],
    intent:
      "Checks you prefer roles with temporary credentials over embedded keys.",
    short:
      "Attach an IAM role to the EC2 instance through an instance profile. The AWS SDK on the instance automatically obtains temporary credentials for that role, so the application can call S3 or other services without any secrets stored in code or on disk. Long-term access keys are easy to leak, for example by committing them to git, and must be rotated by hand, so AWS recommends using roles and temporary credentials wherever possible, and updating access keys when long-term credentials are unavoidable.",
    detail: [
      "The role's policy should allow only what the application needs.",
      "If keys are exposed, deactivate and rotate them immediately.",
      "Never hard-code keys or put them in front-end code.",
    ],
    ex: "A Node API on EC2 uploads files to S3 using the instance's role; its source code has no AWS keys.",
    mistakes: [
      "Committing access keys to a repository.",
      "Giving the instance role full administrator rights.",
    ],
    follow: ["What do you do if an access key leaks?"],
    points: [
      "Attach a role to the instance",
      "SDK obtains temporary credentials",
      "No keys in code",
      "Least-privilege role policy",
    ],
    notes: ["Roles, not keys."],
    src: [
      [
        "AWS IAM: Use an IAM role to grant permissions to applications running on EC2",
        `${IAM}/id_roles_use_switch-role-ec2.html`,
      ],
      [
        "AWS IAM: Update access keys",
        `${IAM}/id-credentials-access-keys-update.html`,
      ],
    ],
  }),
  q({
    slug: "s3-what-is-and-buckets-objects",
    topic: "S3 buckets & storage classes",
    d: "easy",
    title: "What is Amazon S3 and how are buckets and objects organised?",
    kw: ["s3", "object storage", "bucket", "object key", "static assets"],
    intent: "A core AWS question: checks you understand object storage.",
    short:
      "Amazon S3 is an object storage service offering scalability, availability, security and performance. Data is stored as objects inside buckets. An object consists of the data and metadata and is identified by a key, its unique name within the bucket; folders in the console are just key prefixes. Bucket names must be unique and follow naming rules, such as 3 to 63 lowercase letters, numbers, periods and hyphens. S3 suits uploads, backups, static websites and data lakes, but it is not a file system or a database.",
    detail: [
      "S3 provides strong read-after-write consistency for object PUT and DELETE requests.",
      "Access is through the console, CLI, SDKs and the REST API.",
      "Versioning, lifecycle rules and encryption are configured per bucket.",
    ],
    ex: "A web app stores user avatars in a bucket under keys like `avatars/42.png`.",
    mistakes: [
      "Treating S3 like a mounted disk.",
      "Choosing a bucket name that violates the rules.",
    ],
    follow: ["What is an object key?"],
    points: [
      "Object storage in buckets",
      "Object = data + metadata + key",
      "Prefixes imitate folders",
      "Strong read-after-write consistency",
    ],
    notes: ["Buckets hold objects identified by keys."],
    src: [
      ["AWS S3: What is Amazon S3?", `${S3}/Welcome.html`],
      [
        "AWS S3: General purpose bucket naming rules",
        `${S3}/bucketnamingrules.html`,
      ],
    ],
  }),
  q({
    slug: "s3-storage-classes",
    topic: "S3 buckets & storage classes",
    d: "medium",
    title: "What are S3 storage classes and how do you choose one?",
    kw: [
      "storage classes",
      "s3 standard",
      "standard-ia",
      "glacier",
      "intelligent-tiering",
    ],
    intent: "Checks you can match access patterns to cost.",
    short:
      "Every object has a storage class, and by default objects are stored in S3 Standard, which suits frequently accessed data with millisecond access. S3 Standard-IA and One Zone-IA are for long-lived, infrequently accessed data: they give millisecond access but charge a retrieval fee. The S3 Glacier classes (Instant Retrieval, Flexible Retrieval and Deep Archive) are for low-cost long-term archives with retrieval fees and minimum storage durations. S3 Intelligent-Tiering moves objects between access tiers automatically when access patterns are unknown or change. Choose by how often you read the data and how quickly you need it back.",
    detail: [
      "One Zone-IA stores data in a single Availability Zone, so it is less resilient to an AZ loss.",
      "Lifecycle rules can move objects to cheaper classes as they age.",
      "Check current pricing and minimum durations before archiving.",
    ],
    ex: "Recent invoices stay in Standard, and older ones move to Glacier after a year.",
    mistakes: [
      "Storing rarely read archives in Standard.",
      "Archiving data that must be read frequently.",
    ],
    follow: ["What does a lifecycle rule do?"],
    points: [
      "Standard is the default",
      "IA classes for infrequent access",
      "Glacier for archives",
      "Intelligent-Tiering for unknown patterns",
    ],
    notes: ["Match class to access frequency."],
    src: [
      [
        "AWS S3: Understanding and managing S3 storage classes",
        `${S3}/storage-class-intro.html`,
      ],
      [
        "AWS S3: Managing the lifecycle of objects",
        `${S3}/object-lifecycle-mgmt.html`,
      ],
    ],
  }),
  q({
    slug: "s3-versioning-and-lifecycle",
    topic: "S3 buckets & storage classes",
    d: "medium",
    title: "What do S3 versioning and lifecycle rules do?",
    kw: [
      "s3 versioning",
      "delete marker",
      "lifecycle rules",
      "expiration",
      "recover deleted objects",
    ],
    intent: "Checks you know how to protect and age data.",
    short:
      "S3 Versioning keeps multiple versions of an object in the same bucket. When you overwrite an object, a new version is created; when you delete it, S3 inserts a delete marker instead of removing the data permanently, so you can restore a previous version after accidental deletion or overwrite. Lifecycle rules automate management: they can transition objects to cheaper storage classes after a number of days or expire (delete) them, including old versions, so storage costs do not grow without bound.",
    detail: [
      "Versioning is off by default and, once enabled, can only be suspended, not removed.",
      "Combine versioning with lifecycle rules that remove old noncurrent versions.",
      "Versioning helps protect against both user mistakes and application bugs.",
    ],
    ex: "A bucket for documents has versioning on and a rule that deletes noncurrent versions after 90 days.",
    mistakes: [
      "Enabling versioning without expiring old versions and paying for them forever.",
      "Assuming delete removes data when versioning is on.",
    ],
    follow: ["What is a delete marker?"],
    points: [
      "Versions preserve overwritten data",
      "Delete adds a delete marker",
      "Lifecycle transitions and expires",
      "Expire old versions",
    ],
    notes: ["Version to recover, lifecycle to control cost."],
    src: [
      [
        "AWS S3: Retaining multiple versions with S3 Versioning",
        `${S3}/Versioning.html`,
      ],
      [
        "AWS S3: Managing the lifecycle of objects",
        `${S3}/object-lifecycle-mgmt.html`,
      ],
    ],
  }),
  q({
    slug: "s3-static-website-hosting",
    topic: "S3 buckets & storage classes",
    d: "medium",
    title: "Can you host a React build on S3, and what else do you need?",
    kw: [
      "static website hosting",
      "s3 website",
      "cloudfront",
      "index document",
      "spa routing",
    ],
    intent: "Checks you know S3 can serve static sites and its limits.",
    short:
      "Yes. S3 can host a static website, such as the built files of a React app, using the website hosting feature with an index document and an error document. S3 website endpoints serve plain HTTP, so for HTTPS, custom domains and caching you normally put Amazon CloudFront in front of the bucket. A single-page app needs the error document or a CloudFront rule to fall back to `index.html` so client-side routes work on refresh. The site content has no server-side code; it calls APIs for dynamic data.",
    detail: [
      "If the bucket uses SSE-KMS encryption, AWS documentation says you must serve through CloudFront because anonymous access is not supported for SSE-KMS.",
      "Prefer keeping the bucket private and giving CloudFront access, rather than making it public.",
      "Deploying means syncing the build output to the bucket.",
    ],
    ex: "`npm run build` produces `dist`, which is synced to a bucket fronted by CloudFront for HTTPS.",
    mistakes: [
      "Making the whole bucket public when a CDN could access it privately.",
      "No SPA fallback, so deep links return errors.",
    ],
    follow: ["Why add CloudFront?"],
    points: [
      "Static hosting with index and error documents",
      "Website endpoints are HTTP only",
      "CloudFront for HTTPS and caching",
      "SPA fallback needed",
    ],
    notes: ["S3 stores, CloudFront serves securely."],
    src: [
      [
        "AWS S3: Hosting a static website using Amazon S3",
        `${S3}/WebsiteHosting.html`,
      ],
    ],
  }),
  q({
    slug: "s3-block-public-access-and-acls",
    topic: "S3 permissions & policies",
    d: "medium",
    title: "How does S3 stop buckets from being accidentally public?",
    kw: [
      "block public access",
      "public bucket",
      "acl disabled",
      "object ownership",
      "data leak",
    ],
    intent: "Checks you know the guardrails against a common data-leak cause.",
    short:
      "S3 Block Public Access provides settings at the access point, bucket, account and organisation level that override policies and ACLs which would otherwise make data public. By default, new buckets, access points and objects do not allow public access. Also by default, S3 Object Ownership is set to bucket owner enforced, which disables ACLs, so access is managed through policies rather than per-object ACLs. Keep Block Public Access turned on unless a bucket truly must be public, and use CloudFront or presigned URLs for controlled sharing.",
    detail: [
      "Many data leaks come from buckets made public by mistake.",
      "Review bucket access regularly and enable monitoring.",
      "Settings applied at account level protect every bucket.",
    ],
    ex: "The account has Block Public Access enabled, so even a bad bucket policy cannot expose data.",
    mistakes: [
      "Turning off Block Public Access to fix a permission error.",
      "Using ACLs when policies would do.",
    ],
    follow: ["What is the default for new buckets?"],
    points: [
      "Block Public Access overrides public grants",
      "New buckets are private by default",
      "ACLs disabled by default",
      "Share via CloudFront or presigned URLs",
    ],
    notes: ["Keep Block Public Access on."],
    src: [
      [
        "AWS S3: Blocking public access",
        `${S3}/access-control-block-public-access.html`,
      ],
      ["AWS S3: Security best practices", `${S3}/security-best-practices.html`],
    ],
  }),
  q({
    slug: "s3-bucket-policy-vs-iam-policy",
    topic: "S3 permissions & policies",
    d: "medium",
    title:
      "What is the difference between an S3 bucket policy and an IAM policy?",
    kw: [
      "bucket policy",
      "identity-based policy",
      "resource-based policy",
      "principal",
      "cross-account access",
    ],
    intent: "Checks you can choose where to put a permission.",
    short:
      "An IAM policy is identity-based: it is attached to a user, group or role and says what that identity can do. A bucket policy is resource-based: it is attached to the bucket and says who, through a `Principal`, can do what with the bucket and its objects, and only the bucket owner can attach one. Both are evaluated together, and a request is allowed if either grants access (within the same account) and nothing denies it. Bucket policies are the usual way to grant another AWS account access or to enforce rules such as requiring HTTPS.",
    detail: [
      "Use IAM policies for permissions of your own users and roles.",
      "Use bucket policies for resource-level rules and cross-account sharing.",
      "An explicit deny in either one blocks the access.",
    ],
    ex: "A bucket policy denies any request that does not use HTTPS, and an IAM role policy allows the app to read the bucket.",
    mistakes: [
      "Granting access in both places inconsistently.",
      "Using wildcard principals in a bucket policy.",
    ],
    follow: ["Which policy type has a Principal element?"],
    points: [
      "IAM policy: identity-based",
      "Bucket policy: resource-based with Principal",
      "Evaluated together, deny wins",
      "Bucket policy for cross-account and bucket-wide rules",
    ],
    notes: ["Identity-based vs resource-based."],
    src: [
      ["AWS S3: Bucket policies", `${S3}/bucket-policies.html`],
      [
        "AWS S3: Policies and permissions in Amazon S3",
        `${S3}/access-policy-language-overview.html`,
      ],
    ],
  }),
  q({
    slug: "s3-presigned-urls",
    topic: "S3 permissions & policies",
    d: "medium",
    title: "What is an S3 presigned URL and when would you use one?",
    kw: [
      "presigned url",
      "temporary access",
      "upload directly",
      "expiry",
      "private objects",
    ],
    intent: "Checks you can share private objects without making them public.",
    short:
      "A presigned URL gives temporary access to a specific S3 object, for download or upload, without making it public or giving the recipient AWS credentials. It is generated by an authorised principal, and the URL uses that principal's permissions, so the URL stops working when it expires or when the credentials used to create it expire. A backend generates the URL after authorising the user and returns it to the browser. It is how a web app lets users upload large files directly to S3 and download private files.",
    detail: [
      "Set a short expiry, such as minutes.",
      "Anyone who has the URL can use it until it expires, so treat it like a secret.",
      "Uploading directly to S3 removes the load from your API server.",
    ],
    ex: "The API checks that a user owns an invoice, then returns a 5-minute presigned URL for the PDF in a private bucket.",
    mistakes: [
      "Long-lived URLs.",
      "Generating URLs without checking the user's permission first.",
    ],
    follow: ["Why generate the URL on the server?"],
    points: [
      "Temporary access to one object",
      "Uses the creator's permissions",
      "Expires",
      "Authorise the user before issuing",
    ],
    notes: ["Private bucket, short-lived link."],
    src: [
      [
        "AWS S3: Download and upload objects with presigned URLs",
        `${S3}/using-presigned-url.html`,
      ],
    ],
  }),
  q({
    slug: "s3-encryption-and-cors",
    topic: "S3 permissions & policies",
    d: "medium",
    title:
      "How are S3 objects encrypted, and when do you need a CORS configuration?",
    kw: ["s3 encryption", "sse-s3", "sse-kms", "cors", "browser upload"],
    intent: "Checks you know defaults for data protection and browser access.",
    short:
      "S3 can encrypt objects at rest with server-side encryption, and you can set a default encryption behaviour for a bucket, using keys managed by S3 or by AWS KMS; data in transit should use HTTPS. A CORS configuration on the bucket is needed when a web page from another origin, such as your front end, makes direct browser requests to the bucket, for example uploading with a presigned URL: it lists the allowed origins, methods and headers. Without it, the browser blocks the request even though the URL is valid.",
    detail: [
      "CORS is enforced by the browser; it does not replace permissions.",
      "List only your real origins, not a wildcard, for authenticated use.",
      "Server-to-server calls do not need CORS.",
    ],
    ex: "The React app on `https://app.example.com` uploads straight to S3, so the bucket allows PUT from that origin.",
    mistakes: [
      "Forgetting CORS for browser uploads.",
      "Allowing every origin and every method.",
    ],
    follow: ["Does CORS grant permissions?"],
    points: [
      "Server-side encryption at rest",
      "Default bucket encryption",
      "HTTPS in transit",
      "CORS for cross-origin browser calls",
    ],
    notes: ["Encrypt, and allow only your origins."],
    src: [
      ["AWS S3: Protecting data with encryption", `${S3}/UsingEncryption.html`],
      ["AWS S3: Using cross-origin resource sharing (CORS)", `${S3}/cors.html`],
    ],
  }),
  q({
    slug: "ec2-what-is-and-instance-types",
    topic: "EC2 instances",
    d: "easy",
    title: "What is Amazon EC2 and what are instance types?",
    kw: ["ec2", "virtual server", "instance type", "ami", "ebs"],
    intent:
      "A core AWS question: checks you know what you get when you launch a server.",
    short:
      "Amazon EC2 provides resizable virtual servers, called instances, in the cloud. You launch an instance from an Amazon Machine Image (AMI), which contains the operating system and software, and choose an instance type that sets the CPU, memory, storage and network capacity, with families optimised for general purpose, compute, memory or storage workloads. Instances usually use Amazon EBS volumes for persistent storage, and you control networking with VPC settings and security groups. You are responsible for managing the operating system and applications.",
    detail: [
      "You can change the instance type of a stopped instance to resize it.",
      "Pick the smallest type that meets the load, and monitor it.",
      "Use Auto Scaling groups and load balancers to run several instances.",
    ],
    ex: "A small web application runs on a general-purpose instance, with a larger memory-optimised type for the database server.",
    mistakes: [
      "Over-sizing instances.",
      "Forgetting to patch the operating system.",
    ],
    follow: ["What is an AMI?"],
    points: [
      "Virtual servers on demand",
      "AMI = image to launch from",
      "Instance type sets resources",
      "You manage the OS",
    ],
    notes: ["AMI plus type equals an instance."],
    src: [
      ["AWS EC2: What is Amazon EC2?", `${EC2}/concepts.html`],
      ["AWS EC2: Instance types", `${EC2}/instance-types.html`],
      ["AWS EC2: Amazon Machine Images", `${EC2}/AMIs.html`],
    ],
  }),
  q({
    slug: "ec2-instance-states-and-billing",
    topic: "EC2 instances",
    d: "medium",
    title: "What are the EC2 instance states, and what do you pay for in each?",
    kw: [
      "instance states",
      "stop vs terminate",
      "billing",
      "ebs charges",
      "elastic ip",
    ],
    intent: "Checks you avoid surprise bills and data loss.",
    short:
      "An instance moves through states: `pending` while starting, `running`, `stopping`, `stopped`, `shutting-down` and `terminated`. You are billed for instance usage while it is running (and during stopping if you hibernate), but not while it is stopped or terminated. A stopped instance can be started again and keeps its EBS volumes, which, like Elastic IP addresses, still incur charges regardless of the instance's state. Terminating an instance permanently deletes it and cannot be undone, and by default its root volume is deleted with it.",
    detail: [
      "Stop an instance to save compute cost while keeping the disk.",
      "Terminate to remove it for good, after saving anything you need.",
      "A stopped instance's public IPv4 address changes unless you use an Elastic IP.",
    ],
    ex: "A development server is stopped at night to save money and started again in the morning.",
    mistakes: [
      "Terminating an instance with data you still need.",
      "Forgetting about unattached volumes and Elastic IPs that still cost money.",
    ],
    follow: ["What is the difference between stop and terminate?"],
    points: [
      "States from pending to terminated",
      "Billed while running",
      "Stopped keeps EBS but not compute charges",
      "Terminate is permanent",
    ],
    notes: ["Stop pauses, terminate deletes."],
    src: [
      ["AWS EC2: Instance state changes", `${EC2}/ec2-instance-lifecycle.html`],
      [
        "AWS EC2: Billing and purchasing options",
        `${EC2}/instance-purchasing-options.html`,
      ],
    ],
  }),
  q({
    slug: "ec2-ebs-vs-instance-store-and-eip",
    topic: "EC2 instances",
    d: "medium",
    title: "What are EBS volumes and Elastic IP addresses used for?",
    kw: ["ebs", "elastic ip", "persistent storage", "static ip", "snapshots"],
    intent:
      "Checks you know what survives a stop and how to keep a stable address.",
    short:
      "Amazon EBS provides block storage volumes that attach to EC2 instances and persist independently of the instance, behaving like a disk you can format and mount, and you can back them up with snapshots. An Elastic IP address is a static public IPv4 address that you associate with an instance, so the public address stays the same when the instance is stopped and started; otherwise a public IP is released and a new one assigned. Elastic IPs and volumes are billed whatever the instance's state, so release what you do not use.",
    detail: [
      "Databases and other state belong on EBS or a managed service, not on the instance's temporary storage.",
      "Point DNS at a load balancer or an Elastic IP.",
      "Encrypt volumes and snapshots that hold sensitive data.",
    ],
    ex: "A server's data volume is snapshotted nightly, and DNS points to its Elastic IP.",
    mistakes: [
      "Leaving unattached volumes and unused Elastic IPs.",
      "Relying on a changing public IP for DNS.",
    ],
    follow: [
      "What happens to the public IP when you stop an instance without an Elastic IP?",
    ],
    points: [
      "EBS = persistent block storage",
      "Snapshots back volumes up",
      "Elastic IP = static public address",
      "Both cost money while unused",
    ],
    notes: ["EBS for disks, Elastic IP for a fixed address."],
    src: [
      ["AWS EBS: Amazon EBS volumes", `${EC2}/ebs-volumes.html`],
      ["AWS EC2: Elastic IP addresses", `${EC2}/working-with-eips.html`],
    ],
  }),
  q({
    slug: "ec2-key-pairs-and-ssh",
    topic: "SSH access",
    d: "easy",
    title:
      "How do you connect to a Linux EC2 instance with SSH, and what is a key pair?",
    kw: ["ssh", "key pair", "pem file", "authorized_keys", "ec2-user"],
    intent: "Checks you can connect securely and know what the key is.",
    short:
      "A key pair consists of a public key and a private key. When you launch a Linux instance with a key pair, AWS places the public key in the instance's `~/.ssh/authorized_keys`, and you keep the private key (a `.pem` file) to prove your identity. Connect with `ssh -i key.pem user@public-dns`, where the user name depends on the AMI, for example `ec2-user` for Amazon Linux or `ubuntu` for Ubuntu. The private key file must not be readable by others, so run `chmod 400 key.pem`, and the instance's security group must allow inbound TCP port 22 from your IP.",
    detail: [
      "AWS does not keep a copy of your private key, so if you lose it you cannot recover it.",
      "Never share or commit the private key.",
      "Alternatives such as EC2 Instance Connect or Systems Manager Session Manager avoid long-lived keys and open ports.",
    ],
    ex: "`ssh -i ~/.ssh/my-key.pem ubuntu@ec2-203-0-113-25.compute-1.amazonaws.com` opens a shell on an Ubuntu server.",
    code: [
      [
        "Connect to an instance",
        "bash",
        `chmod 400 my-key.pem\nssh -i my-key.pem ubuntu@ec2-203-0-113-25.compute-1.amazonaws.com`,
        [
          "The key file must be private to your user.",
          "The user name matches the AMI.",
          "Port 22 must be allowed by the security group.",
        ],
      ],
    ],
    mistakes: [
      "Key file permissions too open, so SSH refuses to use it.",
      "Opening port 22 to the whole internet.",
    ],
    follow: ["What if you lose the private key?"],
    points: [
      "Public key on the instance, private key with you",
      "ssh -i key.pem user@host",
      "User depends on the AMI",
      "Allow port 22 from your IP only",
    ],
    notes: ["Private key stays private."],
    src: [
      ["AWS EC2: Key pairs", `${EC2}/ec2-key-pairs.html`],
      [
        "AWS EC2: Connect to your Linux instance using an SSH client",
        `${EC2}/connect-linux-inst-ssh.html`,
      ],
    ],
  }),
  q({
    slug: "ssh-connection-troubleshooting",
    topic: "SSH access",
    d: "medium",
    title: "What do you check when you can't SSH into an EC2 instance?",
    kw: [
      "ssh timeout",
      "permission denied publickey",
      "security group port 22",
      "wrong user",
      "key permissions",
    ],
    intent: "Checks you have a systematic checklist for connection problems.",
    short:
      "Work through the likely causes. A timeout usually means the network path is blocked: the security group does not allow inbound port 22 from your current IP, a network ACL or firewall blocks it, the instance has no public IP or route, or it is not running. `Permission denied (publickey)` means the key or user is wrong: use the correct private key for the instance, the right user name for the AMI, and `chmod 400` the key file. `Connection refused` means nothing is listening on the port, such as SSH not running or a different port configured. The instance's status checks and system log help diagnose it.",
    detail: [
      "Your public IP may have changed since you created the rule.",
      "Use `ssh -v` for verbose output.",
      "Use the browser-based or Session Manager connection as an alternative path.",
    ],
    ex: "After switching networks, SSH times out until the security group rule is updated to the new IP.",
    mistakes: [
      "Opening port 22 to 0.0.0.0/0 as a quick fix.",
      "Trying the wrong user name.",
    ],
    follow: ["What does Permission denied (publickey) point to?"],
    points: [
      "Timeout = network or security group",
      "Permission denied = key or user",
      "Connection refused = nothing listening",
      "ssh -v shows details",
    ],
    notes: ["Timeout is network, denied is credentials."],
    src: [
      [
        "AWS EC2: Connect to your Linux instance using an SSH client",
        `${EC2}/connect-linux-inst-ssh.html`,
      ],
      ["AWS EC2: Key pairs", `${EC2}/ec2-key-pairs.html`],
    ],
  }),
  q({
    slug: "security-groups-basics",
    topic: "Security groups",
    d: "easy",
    title: "What is a security group and how do its rules work?",
    kw: [
      "security group",
      "inbound rules",
      "outbound rules",
      "stateful",
      "firewall",
    ],
    intent:
      "A core AWS question: checks you understand the instance-level firewall.",
    short:
      "A security group acts as a virtual firewall for EC2 instances and other resources, controlling inbound and outbound traffic. You can specify allow rules but not deny rules, so anything not allowed is blocked. A new security group has no inbound rules, so no inbound traffic is allowed until you add some, and it has an outbound rule that allows all outbound traffic. Security groups are stateful: response traffic for an allowed request flows back regardless of the opposite direction's rules.",
    detail: [
      "A rule specifies protocol, port range and a source or destination, such as a CIDR block or another security group.",
      "An instance can have several security groups, and their rules are combined.",
      "Changes apply immediately to associated instances.",
    ],
    ex: "A web server's security group allows inbound TCP 80 and 443 from anywhere and SSH only from the office IP.",
    mistakes: [
      "Opening all ports to 0.0.0.0/0.",
      "Expecting to write a deny rule.",
    ],
    follow: ["What does stateful mean?"],
    points: [
      "Virtual firewall for resources",
      "Allow rules only",
      "Default: no inbound, all outbound",
      "Stateful",
    ],
    notes: ["Allow only what is needed."],
    src: [
      ["AWS EC2: Security groups", `${EC2}/ec2-security-groups.html`],
      ["AWS: Security group rules", `${EC2}/security-group-rules.html`],
    ],
  }),
  q({
    slug: "security-group-tiered-design",
    topic: "Security groups",
    d: "medium",
    title: "How do you design security groups for a web server and a database?",
    kw: [
      "security group reference",
      "least privilege network",
      "database port",
      "three-tier",
      "source security group",
    ],
    intent: "Checks you can limit exposure by chaining groups.",
    short:
      "Give each tier its own security group. The web or load balancer group allows inbound 80 and 443 from the internet. The application group allows its port only from the load balancer's security group. The database group allows the database port, such as 5432 for PostgreSQL or 3306 for MySQL, only from the application's security group, not from any IP range, and the database sits in private subnets without a public address. Referencing groups instead of IPs keeps rules correct as instances come and go, and exposes only what must be public.",
    detail: [
      "Never open the database port to 0.0.0.0/0.",
      "Administrative access such as SSH should be limited to specific addresses or use a managed session service.",
      "Keep rules documented and review them regularly.",
    ],
    ex: "The RDS instance accepts connections only from the API servers' security group.",
    mistakes: [
      "Public database with an open port.",
      "Rules based on individual IPs that go stale.",
    ],
    follow: ["Why reference another security group as the source?"],
    points: [
      "One group per tier",
      "Chain by security group reference",
      "Database reachable only from the app tier",
      "No public database",
    ],
    notes: ["Chain the groups, hide the database."],
    src: [
      ["AWS: Security group rules", `${EC2}/security-group-rules.html`],
      [
        "AWS: Security group rules for different use cases",
        `${EC2}/security-group-rules-reference.html`,
      ],
    ],
  }),
  q({
    slug: "rds-what-is-and-engines",
    topic: "RDS basics",
    d: "easy",
    title:
      "What is Amazon RDS and why use it instead of installing a database on EC2?",
    kw: ["rds", "managed database", "backups", "patching", "db engines"],
    intent: "Checks you know the benefit of a managed database.",
    short:
      "Amazon RDS is a managed relational database service. It supports engines such as MySQL, PostgreSQL, MariaDB, Oracle Database, Microsoft SQL Server and IBM Db2. RDS handles much of the routine administration: provisioning, backups, software patching, automatic failure detection and recovery, so you focus on schema and queries. Installing a database on EC2 gives full control but makes you responsible for installation, patching, backups, replication and failover.",
    detail: [
      "You still manage security groups, users and database design.",
      "You connect with a normal database client using the instance endpoint.",
      "You do not get operating system access to the underlying host.",
    ],
    ex: "A team runs PostgreSQL on RDS so it does not have to script its own backups and failover.",
    mistakes: [
      "Assuming managed means no configuration is needed.",
      "Leaving the database publicly accessible.",
    ],
    follow: ["Which tasks does RDS take over?"],
    points: [
      "Managed relational databases",
      "Multiple engines",
      "Backups, patching, failure recovery",
      "Less control than self-managed",
    ],
    notes: ["Managed database, less admin."],
    src: [
      ["AWS RDS: What is Amazon RDS?", `${RDS}/Welcome.html`],
      ["AWS RDS: Best practices", `${RDS}/CHAP_BestPractices.html`],
    ],
  }),
  q({
    slug: "rds-multi-az-vs-read-replica",
    topic: "RDS basics",
    d: "medium",
    title: "What is the difference between RDS Multi-AZ and read replicas?",
    kw: [
      "multi-az",
      "read replica",
      "failover",
      "high availability",
      "read scaling",
    ],
    intent: "Checks you distinguish availability from read scaling.",
    short:
      "Multi-AZ is for availability: RDS keeps a standby copy in another Availability Zone and fails over to it if the primary has a problem. In a Multi-AZ DB instance deployment the standby provides failover support but does not serve read traffic. A read replica is for scaling reads: it is a read-only copy updated asynchronously from the source, so you can route read-heavy queries to it and take load off the primary. Replicas can lag slightly behind, so they are not a substitute for failover design.",
    detail: [
      "You can use both together.",
      "Applications must direct reads to the replica endpoint explicitly.",
      "Replication lag means a replica can return slightly stale data.",
    ],
    ex: "A reporting dashboard reads from a replica, while production uses Multi-AZ to survive an AZ failure.",
    mistakes: [
      "Thinking a read replica is a failover standby.",
      "Reading data that must be fresh from a replica.",
    ],
    follow: ["Can the Multi-AZ standby serve reads?"],
    points: [
      "Multi-AZ: standby for failover",
      "Replica: read-only copy for scaling",
      "Replication to replicas is asynchronous",
      "Can combine both",
    ],
    notes: ["Availability vs read scaling."],
    src: [
      ["AWS RDS: Multi-AZ deployments", `${RDS}/Concepts.MultiAZ.html`],
      ["AWS RDS: Read replicas", `${RDS}/USER_ReadRepl.html`],
    ],
  }),
  q({
    slug: "rds-backups-and-restore",
    topic: "RDS basics",
    d: "medium",
    title: "How do RDS backups and point-in-time recovery work?",
    kw: [
      "automated backups",
      "backup retention period",
      "point-in-time recovery",
      "snapshots",
      "restore",
    ],
    intent: "Checks you know how to recover data.",
    short:
      "RDS can take automated backups of your DB instance and keeps them for the backup retention period that you specify, and during that period you can recover the instance to any point in time. You can also create manual snapshots, which you keep until you delete them. Restoring creates a new DB instance from the backup rather than overwriting the existing one, so you switch the application to the new endpoint. Test restores regularly, because an untested backup is only a hope.",
    detail: [
      "Automated backups only happen while the instance is available.",
      "Take a manual snapshot before risky changes.",
      "Backups complement, but do not replace, Multi-AZ for availability.",
    ],
    ex: "After an accidental delete, the team restores the database to a few minutes before the mistake into a new instance.",
    mistakes: [
      "Never testing a restore.",
      "A retention period too short for how long problems take to discover.",
    ],
    follow: ["Does a restore overwrite the existing instance?"],
    points: [
      "Automated backups with a retention period",
      "Point-in-time recovery",
      "Manual snapshots persist",
      "Restore creates a new instance",
    ],
    notes: ["Test your restores."],
    src: [
      [
        "AWS RDS: Introduction to backups",
        `${RDS}/USER_WorkingWithAutomatedBackups.html`,
      ],
    ],
  }),
  q({
    slug: "rds-connectivity-and-security",
    topic: "RDS basics",
    d: "medium",
    title: "How do you connect an application to RDS securely?",
    kw: [
      "rds endpoint",
      "private subnet",
      "publicly accessible",
      "ssl tls",
      "encryption at rest",
    ],
    intent: "Checks you keep the database private and encrypted.",
    short:
      "Applications connect to the DB instance's endpoint and port with a standard database driver. Keep the instance in private subnets with public access turned off, and allow the database port only from the application's security group. Encrypt connections with TLS, use strong credentials stored in a secrets manager or environment variables rather than in code, and use least-privilege database users. Encryption at rest is chosen when the instance is created and covers the storage, backups and snapshots. Monitor connections and keep the engine version patched.",
    detail: [
      "Do not use the master user for the application.",
      "Connection pooling avoids exhausting database connections.",
      "Rotate credentials regularly.",
    ],
    ex: "The API connects to `mydb.xxxx.ap-south-1.rds.amazonaws.com:5432` from inside the VPC, and the database has no public address.",
    mistakes: [
      "Making the database public for convenience.",
      "Using the master account in the application.",
    ],
    follow: ["Where do you set encryption at rest?"],
    points: [
      "Use the endpoint",
      "Private subnet, not public",
      "Security group from the app tier only",
      "TLS, secrets, least privilege",
    ],
    notes: ["Private, restricted, encrypted."],
    src: [
      ["AWS RDS: Amazon VPC and Amazon RDS", `${RDS}/USER_VPC.html`],
      [
        "AWS RDS: Encrypting Amazon RDS resources",
        `${RDS}/Overview.Encryption.html`,
      ],
    ],
  }),
])
