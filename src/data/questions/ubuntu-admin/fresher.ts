import { defineQuestions } from "../author"
import { q } from "../compact"

const U = "https://ubuntu.com/server/docs"
const MAN = "https://man7.org/linux/man-pages"

export default defineQuestions("ubuntu-admin", "fresher", [
  q({
    slug: "ubuntu-server-vs-desktop-lts",
    topic: "Installation",
    d: "easy",
    title: "What is Ubuntu Server, and what does LTS mean?",
    kw: ["ubuntu server", "lts", "release cycle", "support", "headless"],
    intent:
      "Checks you choose the right Ubuntu for a server and understand release types.",
    short:
      "Ubuntu Server is the edition of Ubuntu for running services: it has no desktop environment by default, so it uses fewer resources and is managed over SSH. Ubuntu publishes long-term support (LTS) releases, which are supported with security updates for years and are the usual choice for production, as opposed to interim releases that are supported for a short time. Choose an LTS release for servers, plan to upgrade before support ends, and avoid mixing in packages from random sources.",
    detail: [
      "A new LTS release comes out every two years.",
      "Check the installed release with `lsb_release -a` or `/etc/os-release`.",
      "Support periods are listed by Canonical, so check the dates for your version.",
    ],
    ex: "A company deploys its API on an Ubuntu Server LTS image and schedules the next release upgrade.",
    mistakes: [
      "Running a desktop edition or an interim release in production.",
      "Ignoring the end of support date.",
    ],
    follow: ["Why choose an LTS release for servers?"],
    points: [
      "Server edition: no desktop, SSH managed",
      "LTS = long-term support",
      "Interim releases are short-lived",
      "Plan upgrades",
    ],
    notes: ["Servers: LTS."],
    src: [
      ["Ubuntu Server documentation", `${U}/`],
      [
        "Ubuntu Server: Upgrade your release",
        `${U}/how-to/software/upgrade-your-release/`,
      ],
    ],
  }),
  q({
    slug: "ubuntu-server-system-requirements",
    topic: "Installation",
    d: "easy",
    title:
      "What do you need to install Ubuntu Server, and what are the main installation steps?",
    kw: [
      "installation",
      "system requirements",
      "installer",
      "iso",
      "partitioning",
    ],
    intent: "Checks you can describe a basic install.",
    short:
      "You need the Ubuntu Server ISO image, a bootable USB stick or virtual machine, and hardware that meets the published system requirements for memory, disk and CPU. The installer walks through choosing the language and keyboard, network configuration, storage layout (the whole disk or custom partitions, optionally with LVM and encryption), creating the first user and host name, enabling the OpenSSH server, and optionally selecting extra software. After the reboot, you log in or connect over SSH, then update the packages and configure the firewall.",
    detail: [
      "Cloud providers supply ready-made images, so you usually skip installation there.",
      "Automated installs use autoinstall configuration for many machines.",
      "Verify the ISO checksum before use.",
    ],
    ex: "A new virtual machine is installed from the LTS ISO, with OpenSSH enabled, then updated with apt.",
    mistakes: [
      "Skipping the checksum.",
      "Forgetting to enable SSH on a headless server.",
    ],
    follow: ["What is the first thing you do after installation?"],
    points: [
      "ISO on USB or in a VM",
      "Installer: network, storage, user, SSH",
      "Verify the image",
      "Update and secure after install",
    ],
    notes: ["Install, SSH, update, firewall."],
    src: [
      [
        "Ubuntu Server: System requirements",
        `${U}/reference/installation/system-requirements/`,
      ],
      ["Ubuntu Server: Installation", `${U}/how-to/installation/`],
    ],
  }),
  q({
    slug: "post-install-checklist-ubuntu",
    topic: "Installation",
    d: "easy",
    title:
      "What should you do right after installing or creating an Ubuntu server?",
    kw: ["post-install", "updates", "ufw", "ssh keys", "timezone"],
    intent: "Checks you harden and prepare a new server.",
    short:
      "Update the package index and upgrade installed packages (`sudo apt update && sudo apt upgrade`), create a non-root user with sudo rights and use SSH keys, then disable password and root SSH login. Enable the `ufw` firewall allowing only SSH, HTTP and HTTPS as needed, enable automatic security updates with unattended upgrades, set the host name and time zone, and make sure time sync is working. Install only the software you need, and set up monitoring and backups before the server holds real data.",
    detail: [
      "Allow SSH in ufw before enabling it to avoid locking yourself out.",
      "Keep notes or use configuration management so servers are reproducible.",
      "Check `ss -tulpn` to see what is listening.",
    ],
    ex: "A new VPS gets an admin user, key-based SSH, ufw with ports 22, 80 and 443, and unattended security updates.",
    mistakes: [
      "Leaving default passwords or root SSH login.",
      "Enabling the firewall without allowing SSH.",
    ],
    follow: ["Why allow SSH before enabling ufw?"],
    points: [
      "Update first",
      "Non-root sudo user and SSH keys",
      "Firewall allowing only needed ports",
      "Automatic security updates",
    ],
    notes: ["Update, user, keys, firewall."],
    src: [
      ["Ubuntu Server: OpenSSH server", `${U}/how-to/security/openssh-server/`],
      ["Ubuntu Server: Firewalls", `${U}/how-to/security/firewalls/`],
      [
        "Ubuntu Server: Automatic updates",
        `${U}/how-to/software/automatic-updates/`,
      ],
    ],
  }),
  q({
    slug: "netplan-network-configuration",
    topic: "Installation",
    d: "medium",
    title: "How is networking configured on Ubuntu Server with Netplan?",
    kw: ["netplan", "static ip", "dhcp", "yaml", "netplan apply"],
    intent: "Checks you can set an IP address on Ubuntu.",
    short:
      "Ubuntu Server uses Netplan, which reads YAML files in `/etc/netplan/` and generates the configuration for the backend, usually systemd-networkd or NetworkManager. A file lists interfaces under `ethernets` and sets `dhcp4: true` or static `addresses`, a `routes` entry for the gateway, and `nameservers`. Check the syntax and test with `sudo netplan try`, which rolls back automatically if you lose connectivity, and then `sudo netplan apply`. YAML is indentation sensitive, so use spaces and not tabs.",
    detail: [
      "`ip addr` confirms the result.",
      "Cloud images are often configured by cloud-init, which writes the Netplan file.",
      "Mistakes in a remote server's network settings can lock you out, so `netplan try` is safer.",
    ],
    ex: "A server gets a fixed address by setting `dhcp4: false` and listing `addresses: [192.168.1.20/24]`.",
    code: [
      [
        "A static address",
        "yaml",
        `network:\n  version: 2\n  ethernets:\n    ens3:\n      dhcp4: false\n      addresses: [192.168.1.20/24]\n      routes:\n        - to: default\n          via: 192.168.1.1\n      nameservers:\n        addresses: [1.1.1.1, 8.8.8.8]`,
        [
          "The interface name must match `ip link`.",
          "`routes` sets the default gateway.",
          "Nameservers provide DNS.",
        ],
      ],
    ],
    mistakes: ["Tabs in YAML.", "netplan apply over SSH without a safety net."],
    follow: ["What does netplan try do?"],
    points: [
      "YAML in /etc/netplan",
      "dhcp4 or static addresses",
      "netplan try then apply",
      "Verify with ip addr",
    ],
    notes: ["try before apply."],
    src: [
      [
        "Ubuntu Server: Network configuration (Netplan)",
        `${U}/how-to/networking/netplan`,
      ],
      ["ip(8)", `${MAN}/man8/ip.8.html`],
    ],
  }),
  q({
    slug: "apt-update-vs-upgrade",
    topic: "Package manager (apt)",
    d: "easy",
    title:
      "What is the difference between apt update, upgrade and full-upgrade?",
    kw: [
      "apt update",
      "apt upgrade",
      "apt full-upgrade",
      "package index",
      "dist-upgrade",
    ],
    intent:
      "A classic: checks you know the index is separate from the packages.",
    short:
      "`apt update` downloads the latest package lists from the configured repositories, so apt knows which versions exist, but it does not install anything. `apt upgrade` installs newer versions of the packages already installed, without removing packages or installing new dependencies that would be needed, and `apt full-upgrade` also allows removing or installing packages to complete the upgrade, which can be needed when dependencies change. `apt autoremove` removes dependencies no longer needed. Run `update` before `upgrade` or `install`.",
    detail: [
      "Ubuntu's phased updates may delay some packages for a share of machines.",
      "Kernel updates need a reboot to take effect; `/var/run/reboot-required` appears when needed.",
      "Test upgrades on staging before production when possible.",
    ],
    ex: "`sudo apt update && sudo apt upgrade -y` keeps a server's packages current.",
    mistakes: [
      "Expecting apt update to upgrade packages.",
      "Never rebooting after kernel updates.",
    ],
    follow: ["Which command refreshes the list of available packages?"],
    points: [
      "update = refresh lists",
      "upgrade = install newer versions",
      "full-upgrade may add or remove packages",
      "Reboot for kernel updates",
    ],
    notes: ["update, then upgrade."],
    src: [
      [
        "Ubuntu Server: Package management",
        `${U}/how-to/software/package-management/`,
      ],
      [
        "Ubuntu Server: About apt upgrade and phased updates",
        `${U}/explanation/software/about-apt-upgrade-and-phased-updates/`,
      ],
    ],
  }),
  q({
    slug: "apt-install-remove-purge-search",
    topic: "Package manager (apt)",
    d: "easy",
    title: "How do you install, remove and search for packages with apt?",
    kw: ["apt install", "apt remove", "apt purge", "apt search", "apt show"],
    intent: "Checks you can manage software day to day.",
    short:
      "`sudo apt install nginx` installs a package and its dependencies, `sudo apt remove nginx` removes the program but leaves its configuration files, and `sudo apt purge nginx` removes the configuration as well. `apt search keyword` finds packages, `apt show nginx` displays details such as version and dependencies, `apt list --installed` lists installed packages, and `sudo apt autoremove` removes unneeded dependencies. `dpkg -l` and `dpkg -L package` show installed packages and the files a package provides. Installing a specific version uses `package=version`.",
    detail: [
      "`-y` answers yes to prompts, useful in scripts and Dockerfiles.",
      "In scripts prefer `apt-get`, which has a stable interface.",
      "Hold a package at its version with `apt-mark hold`.",
    ],
    ex: "`apt show postgresql` shows which versions are available in the enabled repositories.",
    mistakes: [
      "Using remove when purge is needed to clear config.",
      "Installing from unknown repositories.",
    ],
    follow: ["What is the difference between remove and purge?"],
    points: [
      "install, remove, purge",
      "search and show",
      "autoremove cleans dependencies",
      "dpkg for low-level queries",
    ],
    notes: ["purge also removes config."],
    src: [
      [
        "Ubuntu Server: Package management",
        `${U}/how-to/software/package-management/`,
      ],
      ["dpkg(1)", `${MAN}/man1/dpkg.1.html`],
    ],
  }),
  q({
    slug: "apt-repositories-and-keys",
    topic: "Package manager (apt)",
    d: "medium",
    title:
      "What are apt repositories, and how do you add a third-party one safely?",
    kw: [
      "apt repositories",
      "sources.list",
      "gpg key",
      "ppa",
      "trusted source",
    ],
    intent:
      "Checks you understand where packages come from and the risk of adding sources.",
    short:
      "A repository is a server hosting packages and a signed index. Apt's sources are listed in `/etc/apt/sources.list` and files in `/etc/apt/sources.list.d/`, and Ubuntu's own repositories are divided into components such as main, universe, restricted and multiverse. A third-party repository must be trusted, because its packages run as root during installation. Add its signing key to a dedicated keyring and reference it in the source entry with `signed-by`, instead of trusting the key system-wide, then run `apt update`. Prefer official repositories, and remove sources you no longer use.",
    detail: [
      "A PPA is a personal package archive added with `add-apt-repository`; trust only publishers you know.",
      "Packages are verified with the repository's signature.",
      "A broken repository entry causes errors on `apt update`.",
    ],
    ex: "A database vendor's official repository is added with its signing key to get a newer version than Ubuntu's.",
    mistakes: [
      "Adding random PPAs.",
      "Trusting a key globally instead of per repository.",
    ],
    follow: ["Why is an extra repository a security risk?"],
    points: [
      "Repositories host signed packages",
      "Sources in sources.list.d",
      "Add keys with signed-by",
      "Trust only official sources",
    ],
    notes: ["Third-party repo = trusting root access."],
    src: [
      [
        "Ubuntu Server: Package management",
        `${U}/how-to/software/package-management/`,
      ],
      [
        "Ubuntu Server: Automatic updates",
        `${U}/how-to/software/automatic-updates/`,
      ],
    ],
  }),
  q({
    slug: "unattended-upgrades-security-updates",
    topic: "Package manager (apt)",
    d: "medium",
    title: "How do you keep an Ubuntu server patched automatically?",
    kw: [
      "unattended-upgrades",
      "security updates",
      "automatic updates",
      "reboot required",
      "patching",
    ],
    intent: "Checks you automate security patching safely.",
    short:
      "Install and enable the `unattended-upgrades` package, which automatically installs security updates (and optionally others) according to `/etc/apt/apt.conf.d/50unattended-upgrades` and a periodic setting in `20auto-upgrades`. It can send mail and reboot automatically if you allow it, because kernel updates need a reboot to apply. Patching quickly closes known holes, but automatic changes can occasionally break an application, so test major updates on staging, monitor, and schedule reboots at suitable times. Check logs in `/var/log/unattended-upgrades/`.",
    detail: [
      "`sudo dpkg-reconfigure unattended-upgrades` enables it interactively.",
      "Livepatch services can apply kernel fixes without reboot for supported releases.",
      "Pin versions or hold packages for components that must not change.",
    ],
    ex: "Security updates install nightly, and a maintenance window handles reboots.",
    mistakes: [
      "Never patching a server.",
      "Automatic reboots in the middle of the working day.",
    ],
    follow: ["Why are reboots sometimes required?"],
    points: [
      "unattended-upgrades installs updates automatically",
      "Configured in apt.conf.d",
      "Kernel updates need reboots",
      "Check logs and test",
    ],
    notes: ["Patch quickly, reboot deliberately."],
    src: [
      [
        "Ubuntu Server: Automatic updates",
        `${U}/how-to/software/automatic-updates/`,
      ],
    ],
  }),
  q({
    slug: "ubuntu-release-upgrade",
    topic: "Package manager (apt)",
    d: "medium",
    title: "How do you upgrade an Ubuntu server to a new release?",
    kw: [
      "do-release-upgrade",
      "release upgrade",
      "backup",
      "lts to lts",
      "end of life",
    ],
    intent: "Checks you can plan a distribution upgrade.",
    short:
      "Fully update the current release and reboot, take a backup or snapshot, read the release notes, and then run `sudo do-release-upgrade`, which switches the repositories, upgrades packages and asks about configuration file changes. LTS systems normally upgrade to the next LTS only when it is available and ready. Run it in a way that survives a lost connection (the tool starts a backup SSH session on another port, but a console or tmux is safer), review third-party repositories, and test applications afterwards. Plan this before the old release reaches end of support.",
    detail: [
      "Disable third-party repositories before the upgrade and re-enable them if they support the new release.",
      "Choose carefully when asked whether to keep or replace modified config files.",
      "For critical systems, build a new server and migrate instead of upgrading in place.",
    ],
    ex: "A staging server is upgraded first and tested before the same steps are applied to production.",
    mistakes: [
      "Upgrading without a backup.",
      "Ignoring the config file prompts.",
    ],
    follow: ["Why upgrade staging first?"],
    points: [
      "Update, back up, read notes",
      "do-release-upgrade",
      "Review config prompts",
      "Plan before end of support",
    ],
    notes: ["Back up, then upgrade."],
    src: [
      [
        "Ubuntu Server: Upgrade your release",
        `${U}/how-to/software/upgrade-your-release/`,
      ],
    ],
  }),
  q({
    slug: "systemd-units-and-targets",
    topic: "Services (systemd)",
    d: "medium",
    title: "What are systemd units and targets?",
    kw: ["systemd", "unit files", "targets", "service unit", "dependencies"],
    intent: "Checks you understand how Ubuntu manages services and boot.",
    short:
      "systemd is the init system on Ubuntu. It manages units, which are described in unit files: services (`.service`) for daemons, sockets, timers (`.timer`, a modern cron alternative), mounts and more. Units declare dependencies and ordering (`Requires`, `After`), so services start in the right order and in parallel where possible. Targets group units into states, such as `multi-user.target` for a normal server or `graphical.target` for a desktop, and `systemctl get-default` shows the default. Vendor units live in `/lib/systemd/system` and your overrides in `/etc/systemd/system`.",
    detail: [
      "`systemctl edit service` creates an override drop-in without editing vendor files.",
      "`systemctl list-dependencies` shows the unit tree.",
      "`systemd-analyze blame` shows what slowed down boot.",
    ],
    ex: "A custom `myapp.service` runs after `network-online.target` and is wanted by `multi-user.target`.",
    mistakes: [
      "Editing vendor unit files directly.",
      "Forgetting daemon-reload.",
    ],
    follow: ["What is a target?"],
    points: [
      "Units describe things to manage",
      "Dependencies and ordering",
      "Targets group units into states",
      "Overrides in /etc/systemd/system",
    ],
    notes: ["Units are the building blocks."],
    src: [
      ["systemd.service(5)", `${MAN}/man5/systemd.service.5.html`],
      ["systemctl(1)", `${MAN}/man1/systemctl.1.html`],
    ],
  }),
  q({
    slug: "systemctl-manage-services-ubuntu",
    topic: "Services (systemd)",
    d: "easy",
    title: "How do you start, stop, enable and check a service on Ubuntu?",
    kw: [
      "systemctl start",
      "systemctl enable",
      "systemctl status",
      "service restart",
      "reload",
    ],
    intent: "A daily task for administrators.",
    short:
      "Use `systemctl`: `sudo systemctl start nginx` and `stop` control the service now; `restart` stops and starts it, and `reload` re-reads configuration without dropping connections where supported; `enable` makes it start at boot, `disable` stops that, and `enable --now` does both enable and start. `systemctl status nginx` shows whether it is active, its main process and recent log lines, `is-active` and `is-enabled` give script-friendly answers, and `systemctl --failed` lists failed units. After changing a unit file, run `sudo systemctl daemon-reload`.",
    detail: [
      "Test configs before reloading: `nginx -t`.",
      "`mask` prevents a service from being started at all.",
      "The older `service nginx restart` still works as a wrapper.",
    ],
    ex: "After installing nginx, `sudo systemctl enable --now nginx` starts it and keeps it running after reboots.",
    mistakes: [
      "Forgetting enable.",
      "Restarting a production service when reload would do.",
    ],
    follow: ["What does reload do differently from restart?"],
    points: [
      "start, stop, restart, reload",
      "enable for boot",
      "status for state and logs",
      "daemon-reload after unit edits",
    ],
    notes: ["start now, enable at boot."],
    src: [["systemctl(1)", `${MAN}/man1/systemctl.1.html`]],
  }),
  q({
    slug: "write-a-service-unit-ubuntu",
    topic: "Services (systemd)",
    d: "medium",
    title: "How do you write a systemd service for your own application?",
    kw: [
      "service unit",
      "ExecStart",
      "Restart=on-failure",
      "User=",
      "EnvironmentFile",
    ],
    intent: "Checks you can supervise your own app with systemd.",
    short:
      "Create `/etc/systemd/system/myapp.service` with a `[Unit]` section (a description and `After=network.target`), a `[Service]` section with `ExecStart` (the full path of the command), `WorkingDirectory`, `User` for an unprivileged account, `Environment` or `EnvironmentFile` for configuration, and `Restart=on-failure`, and an `[Install]` section with `WantedBy=multi-user.target`. Then run `sudo systemctl daemon-reload` and `sudo systemctl enable --now myapp`. Check it with `systemctl status myapp` and read its output with `journalctl -u myapp -f`. Hardening options such as `NoNewPrivileges=true` limit damage from compromise.",
    detail: [
      "`ExecStart` requires absolute paths.",
      "Use `Type=simple` for processes that stay in the foreground, which is typical for Node apps.",
      "`RestartSec` avoids tight restart loops.",
    ],
    ex: "A Node API runs as the `deploy` user, restarts on failure and logs to the journal.",
    mistakes: [
      "Relative paths in ExecStart.",
      "Running the service as root without need.",
    ],
    follow: ["How do you read the service's output?"],
    points: [
      "[Unit], [Service], [Install]",
      "ExecStart absolute path",
      "User and Restart settings",
      "daemon-reload, enable --now",
    ],
    notes: ["Unprivileged user, restart on failure."],
    src: [
      ["systemd.service(5)", `${MAN}/man5/systemd.service.5.html`],
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
    ],
  }),
  q({
    slug: "systemd-timers-vs-cron",
    topic: "Services (systemd)",
    d: "hard",
    title: "What are systemd timers and how do they compare with cron?",
    kw: ["systemd timer", "OnCalendar", "cron", "scheduled jobs", "Persistent"],
    intent: "Checks you know the systemd alternative for scheduling.",
    short:
      "A systemd timer is a `.timer` unit that activates a matching `.service` unit on a schedule, defined with `OnCalendar=` (calendar times) or relative settings like `OnBootSec=`. Compared with cron, timers log to the journal, can depend on other units, run missed jobs after downtime with `Persistent=true`, and can limit resources or security with the service unit's options. Cron is simpler for quick jobs. List timers with `systemctl list-timers` and test calendar expressions with `systemd-analyze calendar`.",
    detail: [
      "The service does the work, and the timer only triggers it.",
      "Enable the timer, not the service: `systemctl enable --now backup.timer`.",
      "`OnCalendar=daily` or `*-*-* 02:30:00` expresses schedules.",
    ],
    ex: "A nightly backup runs from `backup.timer`, and a missed run after downtime happens at the next boot.",
    mistakes: [
      "Enabling the service but not the timer.",
      "Wrong calendar syntax.",
    ],
    follow: ["What does Persistent=true do?"],
    points: [
      "Timer triggers a service",
      "OnCalendar schedules",
      "Journal logging and Persistent",
      "list-timers shows next runs",
    ],
    notes: ["Timer plus service."],
    src: [
      ["systemd.service(5)", `${MAN}/man5/systemd.service.5.html`],
      ["systemctl(1)", `${MAN}/man1/systemctl.1.html`],
    ],
  }),
  q({
    slug: "journalctl-basics-ubuntu",
    topic: "Logs (journalctl)",
    d: "easy",
    title: "How do you read logs with journalctl?",
    kw: [
      "journalctl",
      "journalctl -u",
      "journalctl -f",
      "since until",
      "priority",
    ],
    intent: "A daily troubleshooting skill on Ubuntu.",
    short:
      'systemd\'s journal collects logs from services, the kernel and the system. `journalctl` shows them all, and the most useful options are `-u nginx` for one service, `-f` to follow new entries, `-n 100` for the last 100 lines, `-b` for the current boot, `--since "1 hour ago"` and `--until` for time ranges, and `-p err` to show only errors and worse. `--no-pager` prints without paging, useful in scripts. Combine them: `journalctl -u myapp -p err --since today`.',
    detail: [
      "`journalctl -k` shows kernel messages like `dmesg`.",
      "Output can be JSON with `-o json` for tools.",
      "Run it with sudo or as a user in the `systemd-journal` or `adm` group to see all logs.",
    ],
    ex: "`journalctl -u ssh -p warning --since yesterday` shows suspicious SSH warnings from the last day.",
    mistakes: [
      "Forgetting sudo and seeing only your own entries.",
      "Reading all logs instead of filtering by unit and time.",
    ],
    follow: ["How do you follow a service's logs?"],
    points: [
      "-u unit, -f follow, -n lines",
      "-b boot, --since/--until",
      "-p priority",
      "Needs privileges for all logs",
    ],
    notes: ["Filter by unit, time and priority."],
    src: [
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
      [
        "systemd-journald.service(8)",
        `${MAN}/man8/systemd-journald.service.8.html`,
      ],
    ],
  }),
  q({
    slug: "var-log-and-traditional-logs",
    topic: "Logs (journalctl)",
    d: "easy",
    title: "Which log files are in /var/log, and which should you check first?",
    kw: ["/var/log", "syslog", "auth.log", "nginx logs", "dpkg.log"],
    intent: "Checks you know where classic logs live on Ubuntu.",
    short:
      "Besides the systemd journal, Ubuntu keeps traditional log files in `/var/log`. `syslog` collects general system messages, `auth.log` records logins, sudo use and SSH authentication, `kern.log` holds kernel messages, `dpkg.log` and `apt/` record package changes, and services keep their own, such as `/var/log/nginx/access.log` and `error.log`. Start with the log of the failing component, then `syslog` or the journal, and use `tail -f` to watch while reproducing the problem. Log rotation compresses old files into `.gz` archives, which you read with `zcat` or `zgrep`.",
    detail: [
      "`/var/log/auth.log` is where brute-force SSH attempts show up.",
      "Make sure logs rotate so the disk does not fill.",
      "Access to some logs requires root or membership of the `adm` group.",
    ],
    ex: "`sudo grep 'Failed password' /var/log/auth.log | tail` shows recent failed SSH logins.",
    mistakes: [
      "Forgetting rotated .gz logs when looking back in time.",
      "Ignoring auth.log.",
    ],
    follow: ["Where do SSH login attempts appear?"],
    points: [
      "syslog, auth.log, kern.log",
      "Service logs in their own folders",
      "Rotated logs are compressed",
      "tail -f while reproducing",
    ],
    notes: ["auth.log for access, syslog for everything."],
    src: [
      ["logrotate(8)", `${MAN}/man8/logrotate.8.html`],
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
    ],
  }),
  q({
    slug: "journal-size-persistence-and-rotation",
    topic: "Logs (journalctl)",
    d: "medium",
    title:
      "How do you control the size and persistence of the systemd journal?",
    kw: [
      "journald.conf",
      "SystemMaxUse",
      "journalctl --vacuum",
      "persistent journal",
      "disk usage",
    ],
    intent: "Checks you can stop logs filling the disk.",
    short:
      "The journal's size is limited by settings in `/etc/systemd/journald.conf`, such as `SystemMaxUse=500M`, and whether it persists across reboots depends on `Storage=`: with `persistent`, logs are stored in `/var/log/journal`, otherwise only in memory. Check usage with `journalctl --disk-usage`, and trim old entries with `journalctl --vacuum-size=200M` or `--vacuum-time=2weeks`. After editing the configuration, restart `systemd-journald`. Set sensible limits so logs stay useful but cannot fill the disk, and ship important logs to a central system.",
    detail: [
      "Messages can be lost if the journal rate-limits a flood from one service.",
      "Persistent logs are essential to debug crashes that cause a reboot.",
      "Retention requirements may demand shipping logs elsewhere.",
    ],
    ex: "After a disk filled up, the team set `SystemMaxUse=1G` and vacuumed the old entries.",
    mistakes: [
      "Unlimited journal growth.",
      "Volatile logs on a server that reboots after crashes.",
    ],
    follow: ["How do you reduce the journal to 200 MB now?"],
    points: [
      "journald.conf settings",
      "Storage=persistent keeps logs",
      "--disk-usage and --vacuum-*",
      "Restart journald after changes",
    ],
    notes: ["Limit and persist."],
    src: [
      [
        "systemd-journald.service(8)",
        `${MAN}/man8/systemd-journald.service.8.html`,
      ],
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
    ],
  }),
  q({
    slug: "troubleshoot-failed-service-ubuntu",
    topic: "Logs (journalctl)",
    d: "medium",
    title: "A service fails to start on Ubuntu: how do you find out why?",
    kw: [
      "failed service",
      "systemctl status",
      "journalctl -xe",
      "exit code",
      "troubleshooting",
    ],
    intent: "Checks you have a repeatable diagnosis routine.",
    short:
      "Start with `systemctl status service`, which shows the state (such as `failed`), the exit code or signal, and the last log lines. Then read more with `journalctl -u service -n 100 --no-pager` or `journalctl -xe`. Typical causes are a configuration syntax error (test with the program's own check, for example `nginx -t`), a port already in use (`ss -tulpn`), wrong file permissions or missing files, a missing environment variable, a dependency that is not running, or an unreachable database. Fix the cause, run `daemon-reload` if a unit changed, and restart.",
    detail: [
      "`systemctl cat service` shows the unit actually in use, including overrides.",
      "`systemd-analyze verify unit` checks unit file syntax.",
      "Run the command from ExecStart manually as the service user to see errors directly.",
    ],
    ex: "Nginx fails because another process holds port 80; `ss -tulpn` reveals Apache listening, which is then stopped.",
    mistakes: [
      "Restarting repeatedly without reading logs.",
      "Testing as root when the service runs as another user.",
    ],
    follow: ["How do you check which process holds a port?"],
    points: [
      "status then journal",
      "Check config syntax, port, permissions, env",
      "systemctl cat for the real unit",
      "Reproduce as the service user",
    ],
    notes: ["Status, journal, fix, restart."],
    src: [
      ["systemctl(1)", `${MAN}/man1/systemctl.1.html`],
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
      ["ss(8)", `${MAN}/man8/ss.8.html`],
    ],
  }),
  q({
    slug: "adduser-vs-useradd-ubuntu",
    topic: "Users & groups",
    d: "easy",
    title:
      "How do you add a user on Ubuntu, and how do adduser and useradd differ?",
    kw: ["adduser", "useradd", "home directory", "passwd", "sudo group"],
    intent: "Checks you know the friendly and low-level tools.",
    short:
      "`sudo adduser alice` is the interactive Debian and Ubuntu front end: it creates the user, a home directory with default files, a matching group, and prompts for a password and details. `useradd` is the low-level tool and needs options such as `-m` to create a home directory and `-s /bin/bash` to choose a shell, and it sets no password until you run `passwd`. Give administrative rights by adding the user to the `sudo` group with `sudo usermod -aG sudo alice`. For SSH access, install the user's public key in `~/.ssh/authorized_keys` with correct permissions.",
    detail: [
      "Use `adduser --disabled-password` for key-only accounts.",
      "`deluser --remove-home alice` deletes the account and its home.",
      "Check with `id alice`.",
    ],
    ex: "A new teammate gets `adduser`, membership of `sudo`, and their public SSH key installed.",
    mistakes: [
      "useradd without -m and no home directory.",
      "Forgetting -a in usermod -aG.",
    ],
    follow: ["Which group grants sudo on Ubuntu?"],
    points: [
      "adduser interactive, useradd low-level",
      "sudo group grants admin",
      "usermod -aG appends",
      "SSH key in authorized_keys",
    ],
    notes: ["adduser for humans, useradd for scripts."],
    src: [
      [
        "Ubuntu Server: User management",
        `${U}/how-to/security/user-management/`,
      ],
      ["useradd(8)", `${MAN}/man8/useradd.8.html`],
    ],
  }),
  q({
    slug: "ubuntu-groups-and-shared-access",
    topic: "Users & groups",
    d: "medium",
    title: "How do groups give users shared access to files on Ubuntu?",
    kw: [
      "groupadd",
      "usermod -aG",
      "shared directory",
      "setgid",
      "group ownership",
    ],
    intent: "Checks you can set up team access properly.",
    short:
      "Create a group with `sudo groupadd devs`, add users with `sudo usermod -aG devs alice`, and make the shared directory belong to the group: `sudo chgrp devs /srv/project` and `sudo chmod 2775 /srv/project`. The leading 2 sets the setgid bit, so new files inherit the `devs` group, and 775 gives the group write access. Users must log out and in for the new membership to apply. This uses group permissions instead of giving everyone broad rights, and `getfacl`/`setfacl` provide finer ACLs when needed.",
    detail: [
      "`groups alice` and `id alice` show memberships.",
      "A default umask of 002 for the group allows group-writable new files.",
      "Avoid sharing one account between several people.",
    ],
    ex: "A project directory is owned by `devs`, so every developer can edit shared files.",
    mistakes: [
      "World-writable directories to 'make it work'.",
      "Not re-logging after adding a group.",
    ],
    follow: ["What does the setgid bit do on a directory?"],
    points: [
      "groupadd and usermod -aG",
      "Directory group plus setgid",
      "Re-login to apply",
      "ACLs for finer control",
    ],
    notes: ["Group plus setgid."],
    src: [
      [
        "Ubuntu Server: User management",
        `${U}/how-to/security/user-management/`,
      ],
      ["chmod(1)", `${MAN}/man1/chmod.1.html`],
      ["setfacl(1)", `${MAN}/man1/setfacl.1.html`],
    ],
  }),
  q({
    slug: "ssh-key-authentication-ubuntu",
    topic: "Users & groups",
    d: "medium",
    title: "How do you set up SSH key login and disable passwords on Ubuntu?",
    kw: [
      "ssh keys",
      "authorized_keys",
      "sshd_config",
      "PasswordAuthentication",
      "PermitRootLogin",
    ],
    intent: "Checks you can secure remote access.",
    short:
      "On your computer generate a key pair with `ssh-keygen -t ed25519` and copy the public key to the server with `ssh-copy-id user@host`, which appends it to `~/.ssh/authorized_keys` there. Check that you can log in with the key. Then edit `/etc/ssh/sshd_config`, set `PasswordAuthentication no` and `PermitRootLogin no`, test the configuration with `sudo sshd -t`, and reload with `sudo systemctl reload ssh`. Keep your existing session open while testing a new one, so a mistake cannot lock you out. Permissions must be strict: `~/.ssh` at 700 and `authorized_keys` at 600.",
    detail: [
      "Protect the private key with a passphrase.",
      "Restrict SSH to the ports and addresses you need in ufw.",
      "Tools like fail2ban can ban repeated failed attempts.",
    ],
    ex: "After the change, password guessing against the server fails immediately because passwords are not accepted.",
    mistakes: [
      "Disabling passwords before testing key login.",
      "Wrong permissions on ~/.ssh.",
    ],
    follow: ["How do you avoid locking yourself out?"],
    points: [
      "ssh-keygen then ssh-copy-id",
      "Disable password and root login",
      "sshd -t before reload",
      "Strict file permissions",
    ],
    notes: ["Test the key before closing the door."],
    src: [
      ["Ubuntu Server: OpenSSH server", `${U}/how-to/security/openssh-server/`],
      ["ssh-keygen(1)", `${MAN}/man1/ssh-keygen.1.html`],
    ],
  }),
  q({
    slug: "ufw-firewall-ubuntu",
    topic: "Users & groups",
    d: "medium",
    title: "How do you configure the ufw firewall on Ubuntu?",
    kw: ["ufw", "allow ssh", "default deny", "ufw status", "ports"],
    intent: "Checks you can open only necessary ports.",
    short:
      "`ufw` (Uncomplicated Firewall) is Ubuntu's front end for the kernel's packet filtering. It is installed but disabled by default. Set the defaults with `sudo ufw default deny incoming` and `sudo ufw default allow outgoing`, allow what you need with `sudo ufw allow OpenSSH` or `sudo ufw allow 80,443/tcp`, and turn it on with `sudo ufw enable`. `sudo ufw status verbose` lists the rules, and `sudo ufw delete allow 80/tcp` removes one. Always allow SSH before enabling, and restrict sources where possible, for example `allow from 203.0.113.5 to any port 22`.",
    detail: [
      "A cloud security group is another layer; both apply.",
      "Docker publishes ports by editing iptables, which can bypass ufw rules, so check what is exposed.",
      "Use `ss -tulpn` to see which ports are actually listening.",
    ],
    ex: "A web server allows OpenSSH from the office IP and ports 80 and 443 from anywhere.",
    mistakes: [
      "Enabling ufw without allowing SSH.",
      "Assuming ufw controls ports published by Docker.",
    ],
    follow: ["What default policy should incoming traffic have?"],
    points: [
      "Default deny incoming",
      "Allow SSH first",
      "ufw enable and status",
      "Cloud firewalls are a second layer",
    ],
    notes: ["Deny by default, allow what you need."],
    src: [["Ubuntu Server: Firewalls", `${U}/how-to/security/firewalls/`]],
  }),
  q({
    slug: "ubuntu-time-sync-and-hostname",
    topic: "Installation",
    d: "easy",
    title:
      "How do you set the hostname, time zone and time synchronisation on Ubuntu?",
    kw: ["hostnamectl", "timedatectl", "set-timezone", "ntp", "timesyncd"],
    intent: "Checks you configure identity and time correctly on a server.",
    short:
      "`sudo hostnamectl set-hostname web-01` sets the host name, and `sudo timedatectl set-timezone Asia/Kolkata` sets the time zone (list zones with `timedatectl list-timezones`). `timedatectl` shows the local and UTC time and whether the system clock is synchronised. Ubuntu synchronises time with `systemd-timesyncd` by default, and `chrony` is available for more advanced needs. Accurate time matters for logs, TLS certificates, tokens and scheduled jobs, and many teams keep servers on UTC.",
    detail: [
      "Update `/etc/hosts` if the host name changes and local resolution depends on it.",
      "Cloud-init may reset the host name on boot unless configured.",
      "Time drift can break authentication such as TOTP.",
    ],
    ex: "`timedatectl status` reports 'System clock synchronized: yes' on a healthy server.",
    mistakes: ["No time synchronisation.", "Mixed time zones across servers."],
    follow: ["Why does server time matter for security?"],
    points: [
      "hostnamectl sets the host name",
      "timedatectl sets zone and shows sync",
      "systemd-timesyncd by default",
      "Prefer UTC on servers",
    ],
    notes: ["Name it, sync it."],
    src: [
      ["hostnamectl(1)", `${MAN}/man1/hostnamectl.1.html`],
      ["timedatectl(1)", `${MAN}/man1/timedatectl.1.html`],
    ],
  }),
  q({
    slug: "ubuntu-disk-and-lvm-basics",
    topic: "Installation",
    d: "medium",
    title: "How do you check and grow disk space on an Ubuntu server?",
    kw: ["lsblk", "df -h", "growpart", "resize2fs", "lvm"],
    intent: "Checks you can reason about storage on a server.",
    short:
      "Check usage with `df -h` and the block device layout with `lsblk`, which shows disks, partitions and mount points. When a cloud disk is enlarged, the partition and then the file system must grow into the new space: extend the partition (for example with `growpart`), then resize the file system (`resize2fs` for ext4, or `xfs_growfs` for XFS). With LVM you extend the logical volume (`lvextend -r -L +10G`) which can also resize the file system. Take a snapshot or backup first, and add monitoring so you are alerted before disks fill.",
    detail: [
      "LVM allows resizing volumes without reformatting.",
      "Many cloud images grow the root file system automatically on first boot.",
      "Mount extra volumes using UUIDs in /etc/fstab.",
    ],
    ex: "After increasing a volume from 20 GB to 40 GB, `growpart` and `resize2fs` make the extra space usable.",
    mistakes: [
      "Resizing without a backup.",
      "Enlarging the volume but not the partition or file system.",
    ],
    follow: [
      "What is the difference between growing a partition and a file system?",
    ],
    points: [
      "df and lsblk show state",
      "Grow the partition, then the file system",
      "LVM eases resizing",
      "Back up and monitor",
    ],
    notes: ["Partition, then file system."],
    src: [
      ["lsblk(8)", `${MAN}/man8/lsblk.8.html`],
      ["mount(8)", `${MAN}/man8/mount.8.html`],
      ["Ubuntu Server: Storage", `${U}/how-to/storage/`],
    ],
  }),
  q({
    slug: "ubuntu-install-nginx-example",
    topic: "Services (systemd)",
    d: "easy",
    title:
      "How would you install and verify a web server such as nginx on Ubuntu?",
    kw: [
      "install nginx",
      "apt install",
      "systemctl enable",
      "ufw allow",
      "curl localhost",
    ],
    intent: "Checks you can combine package, service and firewall steps.",
    short:
      "Update the package index, install with `sudo apt install nginx`, and check that the service is running with `systemctl status nginx` (the package normally starts and enables it). Allow web traffic in the firewall with `sudo ufw allow 'Nginx Full'` or ports 80 and 443, then verify with `curl -I http://localhost` on the server and from your own machine using the server's address. Configuration lives in `/etc/nginx`, logs in `/var/log/nginx`, and changes are applied with `sudo nginx -t && sudo systemctl reload nginx`.",
    detail: [
      "The default site root on Ubuntu is `/var/www/html`.",
      "Use separate files in `sites-available` and enable with a symlink in `sites-enabled`.",
      "Add HTTPS with a certificate before going live.",
    ],
    ex: "After installing nginx, the browser shows the default welcome page, confirming the server and firewall work.",
    mistakes: [
      "Forgetting to open the firewall.",
      "Reloading without testing the configuration.",
    ],
    follow: ["How do you apply an nginx config change safely?"],
    points: [
      "apt install nginx",
      "systemctl status",
      "Open ports 80 and 443",
      "nginx -t, then reload",
    ],
    notes: ["Install, allow, test, reload."],
    src: [
      [
        "Ubuntu Server: Install nginx",
        `${U}/how-to/web-services/install-nginx/`,
      ],
      ["Ubuntu Server: Firewalls", `${U}/how-to/security/firewalls/`],
    ],
  }),
  q({
    slug: "ubuntu-security-basics-apparmor-fail2ban",
    topic: "Users & groups",
    d: "hard",
    title: "What are AppArmor and basic Ubuntu hardening measures?",
    kw: [
      "apparmor",
      "mandatory access control",
      "least privilege",
      "fail2ban",
      "hardening",
    ],
    intent: "Checks you know the extra layers beyond file permissions.",
    short:
      "AppArmor is a Linux security module included in Ubuntu that confines programs with profiles describing which files, capabilities and network access each may use, so a compromised service cannot reach everything the user can. `sudo aa-status` shows loaded profiles and whether they are enforcing or complaining. Other hardening basics are: apply security updates, expose only needed ports through the firewall, use SSH keys, run services as unprivileged users, remove unused packages, and consider tools such as fail2ban to block repeated login attempts. Ubuntu's documentation lists further security tips.",
    detail: [
      "Do not disable AppArmor to fix a problem; adjust the profile or put it in complain mode to learn.",
      "Mandatory access control complements ordinary Unix permissions.",
      "Review listening services regularly.",
    ],
    ex: "A web server's AppArmor profile stops it from reading files outside its allowed directories.",
    mistakes: [
      "Disabling AppArmor instead of fixing a profile.",
      "Leaving unnecessary services running.",
    ],
    follow: ["What does aa-status show?"],
    points: [
      "AppArmor confines programs by profile",
      "Enforce vs complain modes",
      "Updates, firewall, SSH keys, least privilege",
      "Review exposed services",
    ],
    notes: ["Confine and minimise."],
    src: [
      ["Ubuntu Server: AppArmor", `${U}/how-to/security/apparmor/`],
      [
        "Ubuntu Server: Security suggestions",
        `${U}/explanation/security/security_suggestions/`,
      ],
    ],
  }),
])
