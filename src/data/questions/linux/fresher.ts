import { defineQuestions } from "../author"
import { q } from "../compact"

const MAN = "https://man7.org/linux/man-pages"
const BASH = "https://www.gnu.org/software/bash/manual/html_node"

export default defineQuestions("linux", "fresher", [
  q({
    slug: "what-is-linux-and-distributions",
    topic: "Filesystem",
    d: "easy",
    title: "What is Linux, and what is a distribution?",
    kw: ["linux", "kernel", "distribution", "ubuntu", "open source"],
    intent:
      "A foundation question: checks you can separate the kernel from the OS you install.",
    short:
      "Linux is an open-source operating system kernel, the core that manages hardware, processes, memory and file systems. A Linux distribution, such as Ubuntu, Debian, Fedora or Red Hat Enterprise Linux, bundles the kernel with system software, GNU tools, a package manager, an init system such as systemd and often a desktop, configured and supported for a purpose. Most servers, cloud instances and containers run Linux, which is why developers need to be comfortable with its command line.",
    detail: [
      "Distributions differ in package formats (deb, rpm), release cycles and defaults, but share the kernel and most commands.",
      "`uname -r` shows the kernel version, and `/etc/os-release` identifies the distribution.",
      "The same skills carry across distributions.",
    ],
    ex: "An Ubuntu Server image and a Debian image use the same kernel family but different default packages and release schedules.",
    mistakes: [
      "Calling the kernel the whole operating system.",
      "Assuming all distributions use apt.",
    ],
    follow: ["How do you find out which distribution you are on?"],
    points: [
      "Linux is a kernel",
      "Distribution = kernel + tools + package manager",
      "Ubuntu, Debian, Fedora, RHEL",
      "Servers mostly run Linux",
    ],
    notes: ["Kernel plus userland equals distro."],
    src: [
      ["Linux kernel documentation", "https://www.kernel.org/doc/html/latest/"],
      ["uname(1)", `${MAN}/man1/uname.1.html`],
    ],
  }),
  q({
    slug: "linux-directory-structure-fhs",
    topic: "Filesystem",
    d: "easy",
    title: "What are the main directories in the Linux file system?",
    kw: ["filesystem hierarchy", "/etc", "/var", "/home", "/usr"],
    intent: "Checks you know where things live.",
    short:
      "Linux has a single directory tree starting at `/` (root). Key directories are `/home` for users' files, `/etc` for system configuration, `/var` for variable data such as logs (`/var/log`) and spools, `/usr` for installed programs and libraries, `/bin` and `/sbin` for essential commands (often links into `/usr`), `/tmp` for temporary files, `/dev` for device files, `/proc` and `/sys` for kernel information as virtual files, and `/opt` for optional third-party software. The layout is described in `hier(7)`.",
    detail: [
      "Everything, including devices, is accessed through this one tree; extra disks are mounted into it.",
      "`/root` is the root user's home, not to be confused with `/`.",
      "Application data for services usually lives under `/var/lib`.",
    ],
    ex: "Nginx's configuration is in `/etc/nginx` and its logs in `/var/log/nginx`.",
    mistakes: ["Confusing / with /root.", "Putting application data in /tmp."],
    follow: ["Where do logs normally live?"],
    points: [
      "Single tree from /",
      "/etc config, /var data and logs",
      "/home users, /usr programs",
      "/proc and /sys are virtual",
    ],
    notes: ["Config in /etc, logs in /var/log."],
    src: [["hier(7)", `${MAN}/man7/hier.7.html`]],
  }),
  q({
    slug: "absolute-vs-relative-paths",
    topic: "Filesystem",
    d: "easy",
    title: "What is the difference between absolute and relative paths?",
    kw: [
      "absolute path",
      "relative path",
      "cd",
      "dot and dotdot",
      "home directory",
    ],
    intent: "Checks you can navigate confidently.",
    short:
      "An absolute path starts at the root `/` and identifies a location regardless of where you are, such as `/var/log/syslog`. A relative path is interpreted from the current working directory: `logs/app.log` is under the current directory. `.` means the current directory, `..` the parent, and `~` your home directory. `pwd` prints the working directory and `cd` changes it. Scripts should use absolute paths or compute them explicitly, because the working directory depends on how they are started.",
    detail: [
      "`cd -` returns to the previous directory.",
      "Paths with spaces need quoting.",
      "`realpath` resolves a path to its absolute canonical form.",
    ],
    ex: "From `/var/www/app`, `../logs` refers to `/var/www/logs`.",
    mistakes: [
      "Relying on the current directory in cron jobs.",
      "Forgetting to quote paths containing spaces.",
    ],
    follow: ["What does cd - do?"],
    points: [
      "Absolute starts with /",
      "Relative starts from the working directory",
      ". .. ~ shortcuts",
      "pwd and cd",
    ],
    notes: ["Absolute is unambiguous."],
    src: [
      ["GNU Bash manual: Tilde expansion", `${BASH}/Tilde-Expansion.html`],
      ["pwd(1)", `${MAN}/man1/pwd.1.html`],
    ],
  }),
  q({
    slug: "everything-is-a-file-and-links",
    topic: "Filesystem",
    d: "medium",
    title:
      "What does 'everything is a file' mean, and what are hard and symbolic links?",
    kw: ["everything is a file", "symlink", "hard link", "/dev", "ln -s"],
    intent: "Checks you understand a core Unix idea and links.",
    short:
      "In Unix and Linux, many resources are exposed as files under the same interface: regular files, directories, devices like `/dev/sda`, pipes and sockets, and kernel information in `/proc`. That lets the same tools read and write them. A symbolic link (`ln -s target link`) is a small file that holds a path to another file, and it breaks if the target is moved. A hard link (`ln target link`) is another name for the same inode, so the data stays until all names are removed, and it cannot cross file systems or link directories.",
    detail: [
      "`ls -l` shows symlinks with an arrow.",
      "Deleting a symlink does not delete its target.",
      "Symlinks are common for releases: `current -> releases/v1.2`.",
    ],
    ex: "`ln -sfn /srv/app/releases/v2 /srv/app/current` switches the live version atomically.",
    mistakes: [
      "Confusing the two link types.",
      "Moving a target and leaving dangling symlinks.",
    ],
    follow: ["Can a hard link cross file systems?"],
    points: [
      "Many resources are files",
      "Symlink stores a path",
      "Hard link shares the inode",
      "Hard links stay within a file system",
    ],
    notes: ["Symlink points, hard link duplicates the name."],
    src: [
      ["ln(1)", `${MAN}/man1/ln.1.html`],
      ["inode(7)", `${MAN}/man7/inode.7.html`],
    ],
  }),
  q({
    slug: "users-groups-and-etc-passwd",
    topic: "Permissions",
    d: "easy",
    title: "How are users and groups managed in Linux?",
    kw: ["users", "groups", "/etc/passwd", "useradd", "usermod"],
    intent: "Checks you can create users and give them group access.",
    short:
      "Every user has a numeric user ID and belongs to a primary group plus optional supplementary groups. Accounts are defined in `/etc/passwd`, with hashed passwords kept in `/etc/shadow`, readable only by root, and groups in `/etc/group`. Create users with `useradd` (or the friendlier `adduser` on Debian and Ubuntu), set passwords with `passwd`, and add a user to a group with `usermod -aG group user`; the `-a` is essential, or existing groups are replaced. `id` shows a user's IDs and groups.",
    detail: [
      "Service accounts usually have no login shell.",
      "Group changes apply to new login sessions.",
      "`getent passwd` queries users from all configured sources.",
    ],
    ex: "`sudo usermod -aG docker alice` lets Alice use Docker after she logs in again.",
    mistakes: [
      "Using usermod -G without -a, removing other groups.",
      "Running services as root.",
    ],
    follow: ["Where are password hashes stored?"],
    points: [
      "Users and groups have numeric IDs",
      "/etc/passwd, /etc/shadow, /etc/group",
      "usermod -aG adds a group",
      "id shows memberships",
    ],
    notes: ["Append groups with -aG."],
    src: [
      ["useradd(8)", `${MAN}/man8/useradd.8.html`],
      ["usermod(8)", `${MAN}/man8/usermod.8.html`],
      ["id(1)", `${MAN}/man1/id.1.html`],
    ],
  }),
  q({
    slug: "chmod-numeric-and-symbolic",
    topic: "Permissions",
    d: "easy",
    title: "How do chmod's numeric and symbolic modes work?",
    kw: ["chmod", "755", "644", "u+x", "permissions"],
    intent: "A staple: checks you can set permissions correctly.",
    short:
      "Numeric mode uses three octal digits for owner, group and others, each the sum of read 4, write 2 and execute 1: `chmod 755 script.sh` is rwxr-xr-x, and `chmod 644 file` is rw-r--r--. Symbolic mode changes specific bits: `chmod u+x file` adds execute for the owner, `g-w` removes write from the group, `o=r` sets others to read-only, and `a+r` adds read for all. Use `-R` for directories recursively with care. Typical choices are 644 for ordinary files, 755 for scripts and directories, and 600 for secrets.",
    detail: [
      "Directories need execute permission to be entered.",
      "Never fix permission errors with 777.",
      "`ls -l` shows the current permissions.",
    ],
    ex: "SSH refuses a private key unless it is `chmod 600` or stricter.",
    mistakes: ["chmod -R 777.", "Making a secret file world-readable."],
    follow: ["What does chmod 600 mean?"],
    points: [
      "Octal digits for owner, group, others",
      "r=4, w=2, x=1",
      "Symbolic u g o a with + - =",
      "Least privilege",
    ],
    notes: ["755 for programs, 644 for data, 600 for secrets."],
    src: [["chmod(1)", `${MAN}/man1/chmod.1.html`]],
  }),
  q({
    slug: "chown-and-sudo",
    topic: "Permissions",
    d: "easy",
    title:
      "What do chown and sudo do, and why use sudo instead of logging in as root?",
    kw: ["chown", "sudo", "root", "privilege escalation", "sudoers"],
    intent: "Checks you understand ownership and safe elevation.",
    short:
      "`chown user:group path` changes a file's owner and group, and `-R` applies it recursively; usually only root may change ownership. `sudo` runs a single command with the privileges of another user, by default root, if the user is allowed in the `sudoers` configuration, and it logs what was run. Using sudo is safer than working as root, because privileges are used only for the command that needs them, mistakes are limited, and there is an audit trail. Edit sudoers with `visudo`, which checks syntax.",
    detail: [
      "Give users only the sudo rights they need, ideally for specific commands.",
      "Web servers should run as an unprivileged user that owns only the files it must write.",
      "`sudo -i` opens a root shell; avoid staying in it.",
    ],
    ex: "`sudo chown -R deploy:deploy /srv/app` gives the deploy user ownership of the application folder.",
    mistakes: [
      "Working as root all day.",
      "Editing /etc/sudoers directly instead of with visudo.",
    ],
    follow: ["Why use visudo?"],
    points: [
      "chown sets owner and group",
      "sudo elevates one command",
      "Logged and configurable",
      "Edit sudoers with visudo",
    ],
    notes: ["Elevate per command, not per session."],
    src: [
      ["chown(1)", `${MAN}/man1/chown.1.html`],
      ["sudo(8)", `${MAN}/man8/sudo.8.html`],
      ["visudo(8)", `${MAN}/man8/visudo.8.html`],
    ],
  }),
  q({
    slug: "special-permissions-umask",
    topic: "Permissions",
    d: "hard",
    title: "What are setuid, setgid, the sticky bit and umask?",
    kw: ["setuid", "setgid", "sticky bit", "umask", "special permissions"],
    intent: "Checks you know the less obvious permission features.",
    short:
      "Setuid on an executable makes it run with its owner's privileges, as `passwd` does to update the password file; setgid does the same for the group and, on a directory, makes new files inherit the directory's group. The sticky bit on a directory, such as `/tmp`, allows only a file's owner (or root) to delete or rename it even though everyone can write there. `umask` sets which permission bits are removed from newly created files: with umask 022, new files get 644 and new directories 755. Setuid programs are a security risk if flawed, so audit them.",
    detail: [
      "`chmod u+s`, `g+s` and `+t` set these bits; they show as `s` and `t` in `ls -l`.",
      "`find / -perm -4000` lists setuid files.",
      "Shared project folders often use setgid so that group ownership is consistent.",
    ],
    ex: "A shared `/srv/project` directory uses setgid so every new file belongs to the `devs` group.",
    mistakes: [
      "Making scripts setuid.",
      "Not knowing why files are created with 644.",
    ],
    follow: ["What does umask 022 produce for new files?"],
    points: [
      "setuid/setgid run with owner or group rights",
      "Sticky bit limits deletion in shared dirs",
      "umask removes bits from defaults",
      "Audit setuid files",
    ],
    notes: ["s, t, and the mask."],
    src: [
      ["chmod(1)", `${MAN}/man1/chmod.1.html`],
      ["credentials(7)", `${MAN}/man7/credentials.7.html`],
    ],
  }),
  q({
    slug: "ps-top-process-inspection",
    topic: "Processes",
    d: "easy",
    title: "How do you list and monitor processes in Linux?",
    kw: ["ps aux", "top", "htop", "pid", "cpu memory usage"],
    intent: "Checks you can find what is running and what is using resources.",
    short:
      "`ps aux` lists all processes with their owner, PID, CPU and memory usage, state and command, and `ps -ef` gives a similar full listing with parent PIDs. `top` shows a live, sorted view of processes with CPU load, memory and per-process usage, where you can press keys to sort by memory or CPU and to kill a process. To find a specific process combine tools, for example `ps aux | grep node` or `pgrep -a node`. Look at the load average, the %CPU and %MEM columns, and the process state to see what is wrong.",
    detail: [
      "`htop` is a friendlier alternative if installed.",
      "A process in state Z is a zombie and D is waiting on uninterruptible I/O.",
      "`/proc/<pid>` holds detailed information for each process.",
    ],
    ex: "`ps aux --sort=-%mem | head` shows the processes using the most memory.",
    mistakes: [
      "Killing a process before checking what it is.",
      "Forgetting that grep matches itself in the output.",
    ],
    follow: ["What does the load average mean?"],
    points: [
      "ps lists a snapshot",
      "top is live",
      "pgrep finds by name",
      "Check CPU, memory and state",
    ],
    notes: ["ps for a snapshot, top for live."],
    src: [
      ["ps(1)", `${MAN}/man1/ps.1.html`],
      ["top(1)", `${MAN}/man1/top.1.html`],
    ],
  }),
  q({
    slug: "kill-signals-pkill",
    topic: "Processes",
    d: "easy",
    title: "How do you stop a process in Linux?",
    kw: ["kill", "pkill", "killall", "sigterm", "sigkill"],
    intent: "Checks you stop processes politely first.",
    short:
      "Find the PID with `ps` or `pgrep`, then run `kill <pid>`, which sends SIGTERM and lets the program shut down cleanly. If it does not exit, `kill -9 <pid>` sends SIGKILL, which ends it immediately without cleanup, so use it as a last resort. `pkill name` and `killall name` signal processes by name, which affects every match, so check first with `pgrep -a`. A process managed by systemd or PM2 should be stopped through its manager, otherwise it may simply be restarted.",
    detail: [
      "You can only signal your own processes unless you use sudo.",
      "Zombie processes cannot be killed; their parent must reap them.",
      "`kill -l` lists signal names.",
    ],
    ex: "`pkill -f 'node server.js'` stops the matching Node process after `pgrep -af` confirmed the match.",
    mistakes: [
      "Starting with kill -9.",
      "pkill with a broad pattern that kills the wrong things.",
    ],
    follow: ["What is the default signal of kill?"],
    points: [
      "kill sends SIGTERM by default",
      "-9 is a last resort",
      "pkill and killall match names",
      "Use the service manager for services",
    ],
    notes: ["TERM first, KILL last."],
    src: [
      ["kill(1)", `${MAN}/man1/kill.1.html`],
      ["pkill(1)", `${MAN}/man1/pkill.1.html`],
      ["signal(7)", `${MAN}/man7/signal.7.html`],
    ],
  }),
  q({
    slug: "background-jobs-nohup-systemd",
    topic: "Processes",
    d: "medium",
    title: "How do you run a command in the background so it survives logout?",
    kw: ["background job", "nohup", "&", "tmux screen", "systemd service"],
    intent: "Checks you can keep long tasks running on a server.",
    short:
      "Adding `&` runs a command in the background of the current shell, and `jobs`, `fg` and `bg` manage such jobs, but they usually end when the terminal closes. `nohup cmd &` ignores the hangup signal and writes output to `nohup.out`, so it continues after logout. For interactive long-running sessions, use a terminal multiplexer such as `tmux` or `screen`, which you can detach from and reattach to. For anything that should run permanently, like a web server, use a proper service manager such as systemd or PM2 so it restarts and starts on boot.",
    detail: [
      "Redirect output explicitly: `nohup cmd > out.log 2>&1 &`.",
      "`Ctrl+Z` suspends a foreground job and `bg` resumes it in the background.",
      "`disown` removes a job from the shell's job table.",
    ],
    ex: "A one-off data import runs inside a tmux session so it continues if the SSH connection drops.",
    mistakes: [
      "Running a production server with a bare & in an SSH session.",
      "Losing output because it was not redirected.",
    ],
    follow: ["Why prefer systemd for permanent services?"],
    points: [
      "& backgrounds in the shell",
      "nohup survives hangup",
      "tmux/screen for sessions",
      "systemd for services",
    ],
    notes: ["Services belong to a service manager."],
    src: [
      ["nohup(1)", `${MAN}/man1/nohup.1.html`],
      ["tmux(1)", `${MAN}/man1/tmux.1.html`],
      ["GNU Bash manual: Job control", `${BASH}/Job-Control.html`],
    ],
  }),
  q({
    slug: "systemctl-basics-services",
    topic: "Processes",
    d: "medium",
    title: "How do you manage services with systemctl?",
    kw: ["systemctl", "start stop restart", "enable", "status", "unit"],
    intent: "Checks you can control services on a modern Linux server.",
    short:
      "On systemd-based distributions, services are units managed with `systemctl`. `systemctl status nginx` shows state and recent log lines, `start`, `stop`, `restart` and `reload` control it now, and `enable` and `disable` control whether it starts at boot (`enable --now` does both). `systemctl list-units --type=service` lists services, and `systemctl daemon-reload` makes systemd re-read changed unit files. Logs are read with `journalctl -u <service>`. `reload` applies new configuration without dropping connections when the service supports it.",
    detail: [
      "`is-active` and `is-enabled` are useful in scripts.",
      "Unit files live in `/lib/systemd/system` and `/etc/systemd/system`.",
      "A failed service shows `failed` in status; check the journal for why.",
    ],
    ex: "After editing nginx config, `sudo nginx -t && sudo systemctl reload nginx` applies it without downtime.",
    mistakes: [
      "Forgetting enable, so the service is gone after reboot.",
      "Not reading the journal when a service fails.",
    ],
    follow: ["What does enable --now do?"],
    points: [
      "status, start, stop, restart, reload",
      "enable for boot",
      "daemon-reload after unit edits",
      "journalctl -u for logs",
    ],
    notes: ["start now, enable at boot."],
    src: [
      ["systemctl(1)", `${MAN}/man1/systemctl.1.html`],
      ["journalctl(1)", `${MAN}/man1/journalctl.1.html`],
    ],
  }),
  q({
    slug: "cron-scheduled-jobs",
    topic: "Processes",
    d: "medium",
    title: "How do you schedule recurring jobs with cron?",
    kw: [
      "cron",
      "crontab",
      "cron expression",
      "scheduled tasks",
      "environment",
    ],
    intent: "Checks you can write a cron entry and avoid its pitfalls.",
    short:
      "Cron runs commands on a schedule. Edit your table with `crontab -e`; each line has five time fields (minute, hour, day of month, month, day of week) followed by the command, for example `30 2 * * * /srv/app/backup.sh` runs every day at 02:30. `*/5 * * * *` runs every five minutes. Cron jobs run with a minimal environment and no terminal, so use absolute paths, set needed variables, and redirect output to a log file, otherwise failures vanish silently. systemd timers are a modern alternative.",
    detail: [
      "The time zone is the server's, so be aware of UTC versus local time.",
      "Overlapping runs can pile up; use a lock or `flock`.",
      "`crontab -l` lists the current entries.",
    ],
    ex: "A nightly backup at 02:30 appends its output to `/var/log/backup.log`.",
    code: [
      [
        "A cron entry",
        "text",
        `30 2 * * * /srv/app/backup.sh >> /var/log/backup.log 2>&1`,
        [
          "Five time fields then the command.",
          "Output and errors go to a log.",
        ],
      ],
    ],
    mistakes: [
      "Relative paths and missing environment variables.",
      "No logging of output.",
    ],
    follow: ["What do the five fields mean?"],
    points: [
      "Five time fields plus command",
      "crontab -e edits",
      "Minimal environment, use absolute paths",
      "Redirect output",
    ],
    notes: ["Minute hour day month weekday."],
    src: [["crontab(1)", `${MAN}/man1/crontab.1.html`]],
  }),
  q({
    slug: "pipes-and-redirection",
    topic: "Text processing",
    d: "easy",
    title: "How do pipes and redirection work in the shell?",
    kw: ["pipe", "redirection", "stdout stderr", ">> append", "tee"],
    intent: "A core shell skill: combining small commands.",
    short:
      "A pipe `|` connects the standard output of one command to the standard input of the next, so small tools combine into pipelines like `cat access.log | grep 500 | wc -l`. Redirection sends streams to files: `>` writes stdout to a file (overwriting), `>>` appends, `<` reads input from a file, `2>` redirects stderr, and `2>&1` sends stderr to the same place as stdout. `tee` copies a stream to a file and to stdout, and `/dev/null` discards output.",
    detail: [
      "Order matters: `cmd > out.log 2>&1` captures both streams, but `cmd 2>&1 > out.log` does not.",
      "Each command in a pipeline runs as its own process.",
      "`set -o pipefail` makes a pipeline fail if any stage fails.",
    ],
    ex: "`ps aux | sort -nrk 3 | head -5` lists the five biggest CPU users.",
    mistakes: [
      "Overwriting a file with > when >> was intended.",
      "Wrong order of 2>&1.",
    ],
    follow: ["What does 2>&1 do?"],
    points: [
      "| connects stdout to stdin",
      "> overwrite, >> append",
      "2> for stderr",
      "tee splits the stream",
    ],
    notes: ["Small tools, piped."],
    src: [
      ["GNU Bash manual: Redirections", `${BASH}/Redirections.html`],
      ["GNU Bash manual: Pipelines", `${BASH}/Pipelines.html`],
      ["tee(1)", `${MAN}/man1/tee.1.html`],
    ],
  }),
  q({
    slug: "grep-for-searching-text",
    topic: "Text processing",
    d: "easy",
    title: "How do you search text with grep?",
    kw: ["grep", "regular expressions", "grep -r", "grep -i", "grep -v"],
    intent: "Checks you can search files and logs quickly.",
    short:
      "`grep pattern file` prints the lines that match a pattern. Useful options are `-i` for case-insensitive matching, `-n` to show line numbers, `-v` to invert the match, `-c` to count matching lines, `-r` to search directories recursively, `-l` to list matching files, `-E` for extended regular expressions, and `-A`, `-B`, `-C` to show lines of context. It also filters a stream, as in `journalctl -u app | grep -i error`. Quote the pattern so the shell does not expand it.",
    detail: [
      "`grep -F` treats the pattern as a fixed string, which is faster and avoids regex surprises.",
      "Exit status 0 means a match was found, which is useful in scripts.",
      "For code searches, tools like ripgrep are faster but not always installed.",
    ],
    ex: '`grep -rn "TODO" src/` lists every TODO with file name and line number.',
    mistakes: [
      "Forgetting quotes around the pattern.",
      "Expecting grep to match across lines.",
    ],
    follow: ["What does grep -v do?"],
    points: [
      "Matches lines",
      "-i -n -v -c -r -l -E",
      "Context with -A -B -C",
      "Works on files and pipes",
    ],
    notes: ["Quote your pattern."],
    src: [["grep(1)", `${MAN}/man1/grep.1.html`]],
  }),
  q({
    slug: "sed-awk-cut-sort-uniq",
    topic: "Text processing",
    d: "medium",
    title: "How do sed, awk, cut, sort and uniq help process text?",
    kw: ["sed", "awk", "cut", "sort", "uniq"],
    intent: "Checks you can transform and summarise text in a pipeline.",
    short:
      "`sed` edits streams, most often substituting text: `sed 's/old/new/g' file`. `awk` processes text by fields and conditions, for example `awk '{print $1, $3}'` prints columns, and `awk '$9 >= 500'` selects lines by a field value. `cut -d, -f2` extracts a delimited column. `sort` orders lines (`-n` numeric, `-r` reverse, `-k` by key), and `uniq` collapses adjacent duplicates, so `sort | uniq -c | sort -nr` counts and ranks values. Together they summarise logs without writing a program.",
    detail: [
      "`uniq` only removes adjacent duplicates, hence the `sort` before it.",
      "`sed -i` edits files in place; back up first.",
      "`wc -l` counts lines.",
    ],
    ex: "`awk '{print $1}' access.log | sort | uniq -c | sort -nr | head` shows the busiest client IPs.",
    code: [
      [
        "Top client IPs",
        "bash",
        `awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -5`,
        [
          "`awk` extracts the first field.",
          "`sort | uniq -c` counts occurrences.",
          "The last `sort -nr` ranks them.",
        ],
      ],
    ],
    mistakes: ["Using uniq without sort.", "sed -i without a backup."],
    follow: ["Why sort before uniq?"],
    points: [
      "sed substitutes",
      "awk works by fields",
      "cut extracts columns",
      "sort | uniq -c ranks values",
    ],
    notes: ["Extract, sort, count, rank."],
    src: [
      ["sed(1)", `${MAN}/man1/sed.1.html`],
      [
        "GNU awk manual",
        "https://www.gnu.org/software/gawk/manual/html_node/Getting-Started.html",
      ],
      ["uniq(1)", `${MAN}/man1/uniq.1.html`],
    ],
  }),
  q({
    slug: "find-and-xargs",
    topic: "Text processing",
    d: "medium",
    title: "How do you find files with find and act on them with xargs?",
    kw: ["find", "xargs", "-name", "-mtime", "-exec"],
    intent:
      "Checks you can locate files by attributes and process the results.",
    short:
      "`find path -name '*.log'` searches a directory tree by name, and tests can combine: `-type f` for files, `-mtime +7` for modified more than seven days ago, `-size +100M` for large files, `-user` for owner. Actions include `-print` (default), `-delete`, and `-exec cmd {} +` to run a command on the matches. `xargs` builds command lines from its input, as in `find . -name '*.tmp' -print0 | xargs -0 rm`; `-print0` with `xargs -0` handles names with spaces safely. Test with a plain `find` before adding `-delete`.",
    detail: [
      "`-exec cmd {} +` batches many files into one command.",
      "Quote globs so the shell does not expand them before find sees them.",
      "`locate` searches a prebuilt index and is faster but may be stale.",
    ],
    ex: "`find /var/log -name '*.gz' -mtime +30 -delete` removes archived logs older than 30 days.",
    mistakes: [
      "Running -delete before checking the matches.",
      "Filenames with spaces breaking xargs.",
    ],
    follow: ["Why use -print0 and xargs -0?"],
    points: [
      "find by name, type, time, size",
      "-exec runs a command per match",
      "xargs builds commands from input",
      "Use -print0 with xargs -0",
    ],
    notes: ["List first, delete second."],
    src: [
      ["find(1)", `${MAN}/man1/find.1.html`],
      ["xargs(1)", `${MAN}/man1/xargs.1.html`],
    ],
  }),
  q({
    slug: "network-commands-ip-ss-curl",
    topic: "Networking",
    d: "medium",
    title:
      "Which Linux commands inspect network configuration and connectivity?",
    kw: ["ip addr", "ss", "ping", "curl", "dig"],
    intent: "Checks you can diagnose a network problem from the command line.",
    short:
      "`ip addr` shows interfaces and addresses, `ip route` the routing table, and `ping host` tests reachability. `ss -tulpn` lists listening TCP and UDP sockets with their processes, which shows which ports a server is really listening on. `curl -I https://example.com` fetches headers and `curl -v` shows the full exchange, and `dig example.com` queries DNS. `traceroute` shows the path to a host. Work from the local interface outward: address, route, DNS, port, then the application.",
    detail: [
      "`netstat` is the older tool replaced by `ss`.",
      "A service bound to 127.0.0.1 is not reachable from other machines.",
      "`curl --resolve` tests a host name against a specific IP.",
    ],
    ex: "`ss -tulpn | grep 3000` confirms that a Node process is listening on port 3000.",
    mistakes: [
      "Assuming ping failing means the service is down: ICMP may be blocked.",
      "Not checking which address a service binds to.",
    ],
    follow: ["How do you see what is listening on a port?"],
    points: [
      "ip addr and ip route",
      "ss -tulpn for listeners",
      "curl -v for HTTP",
      "dig for DNS",
    ],
    notes: ["Interface, route, DNS, port, app."],
    src: [
      ["ip(8)", `${MAN}/man8/ip.8.html`],
      ["ss(8)", `${MAN}/man8/ss.8.html`],
      ["curl(1)", `${MAN}/man1/curl.1.html`],
    ],
  }),
  q({
    slug: "ssh-scp-rsync-remote-access",
    topic: "Networking",
    d: "medium",
    title: "How do you connect to and copy files between Linux machines?",
    kw: ["ssh", "scp", "rsync", "ssh keys", "ssh-keygen"],
    intent: "Checks you can work with remote servers.",
    short:
      "`ssh user@host` opens a secure shell on a remote machine. For key-based login, generate a key pair with `ssh-keygen`, install the public key on the server (`ssh-copy-id`), and keep the private key secret; keys are safer than passwords. `scp file user@host:/path` copies files over SSH, and `rsync -avz src/ user@host:/dest/` synchronises directories efficiently, sending only differences and supporting resume. `~/.ssh/config` stores shortcuts for hosts. Disable password and root login on servers exposed to the internet.",
    detail: [
      "`ssh -L` forwards a local port through the server for secure access to internal services.",
      "The first connection asks you to confirm the server's host key fingerprint.",
      "Private key files must be `chmod 600`.",
    ],
    ex: "`rsync -avz --delete dist/ deploy@server:/var/www/app/` deploys a static site.",
    mistakes: [
      "Sharing private keys.",
      "Using rsync --delete with a wrong path.",
    ],
    follow: ["Why is rsync better than scp for repeated copies?"],
    points: [
      "ssh for remote shells",
      "Key pairs instead of passwords",
      "scp copies, rsync synchronises",
      "~/.ssh/config for shortcuts",
    ],
    notes: ["Keys over passwords."],
    src: [
      ["ssh(1)", `${MAN}/man1/ssh.1.html`],
      ["rsync(1)", `${MAN}/man1/rsync.1.html`],
      ["ssh-keygen(1)", `${MAN}/man1/ssh-keygen.1.html`],
    ],
  }),
  q({
    slug: "shell-script-basics",
    topic: "Shell scripting",
    d: "easy",
    title: "How do you write and run a basic shell script?",
    kw: ["shell script", "shebang", "chmod +x", "variables", "exit status"],
    intent: "Checks you can automate a task with Bash.",
    short:
      'A shell script is a text file of commands. Start it with a shebang line such as `#!/usr/bin/env bash`, make it executable with `chmod +x script.sh`, and run it with `./script.sh`. Variables are assigned without spaces (`name="Asha"`) and used as `"$name"`; arguments are `$1`, `$2`, with `$#` for the count and `$@` for all. Every command returns an exit status, 0 for success, available as `$?`, and scripts end with `exit` and a status. Always quote variable expansions to handle spaces safely.',
    detail: [
      "Use `set -euo pipefail` near the top to stop on errors and undefined variables.",
      "Use functions to organise longer scripts.",
      "Check scripts with `shellcheck` if available.",
    ],
    ex: "A deploy script takes an environment name as `$1` and exits with an error if none is given.",
    code: [
      [
        "A small script",
        "bash",
        `#!/usr/bin/env bash\nset -euo pipefail\n\nenv="\${1:-}"\nif [ -z "$env" ]; then\n  echo "usage: $0 <env>" >&2\n  exit 1\nfi\necho "Deploying to $env"`,
        [
          "The shebang selects the interpreter.",
          "`set -euo pipefail` stops on errors.",
          "Missing arguments exit with status 1.",
        ],
      ],
    ],
    mistakes: ["Unquoted variables.", "Spaces around = in assignments."],
    follow: ["What does exit status 0 mean?"],
    points: [
      "Shebang, chmod +x, run",
      'Quote "$var"',
      "$1 $@ $# $?",
      "set -euo pipefail",
    ],
    notes: ["Quote, check status, fail early."],
    src: [
      ["GNU Bash manual: Shell scripts", `${BASH}/Shell-Scripts.html`],
      ["GNU Bash manual: The set builtin", `${BASH}/The-Set-Builtin.html`],
      [
        "GNU Bash manual: Special parameters",
        `${BASH}/Special-Parameters.html`,
      ],
    ],
  }),
  q({
    slug: "shell-conditionals-loops-functions",
    topic: "Shell scripting",
    d: "medium",
    title: "How do conditions, loops and functions work in Bash?",
    kw: [
      "if statement",
      "for loop",
      "while loop",
      "functions",
      "test brackets",
    ],
    intent: "Checks you can write control flow in a script.",
    short:
      '`if` runs commands depending on the exit status of a test: `if [[ -f "$file" ]]; then ... fi` checks whether a file exists, with other tests like `-d` (directory), `-z` (empty string), and `-eq` for numbers. `for f in *.log; do ...; done` loops over items, `while read -r line; do ...; done < file` loops over lines, and `case` matches patterns. Functions are defined as `name() { ...; }` and return an exit status; their output is captured with `$(name)`. Use `[[ ]]` in Bash for safer tests.',
    detail: [
      "Use `&&` and `||` to chain on success or failure.",
      "`local` limits a variable to a function.",
      "Quote variables inside tests to avoid word splitting.",
    ],
    ex: "A script loops over all `.log` files and compresses those older than seven days.",
    mistakes: [
      "Unquoted variables in [ ] tests.",
      "Parsing `ls` output in loops instead of using globs.",
    ],
    follow: ["How do you loop over lines of a file?"],
    points: [
      "if with [[ ]] tests",
      "for, while read, case",
      "Functions return status and print output",
      "Use local variables",
    ],
    notes: ["Tests are commands that return a status."],
    src: [
      [
        "GNU Bash manual: Conditional constructs",
        `${BASH}/Conditional-Constructs.html`,
      ],
      [
        "GNU Bash manual: Looping constructs",
        `${BASH}/Looping-Constructs.html`,
      ],
      ["GNU Bash manual: Shell functions", `${BASH}/Shell-Functions.html`],
    ],
  }),
  q({
    slug: "environment-variables-and-path",
    topic: "Shell scripting",
    d: "easy",
    title: "What are environment variables, and what is PATH?",
    kw: ["environment variables", "export", "PATH", ".bashrc", "printenv"],
    intent:
      "Checks you understand how the shell finds commands and passes configuration.",
    short:
      "Environment variables are named values inherited by child processes, used for configuration such as `HOME`, `USER`, `LANG` and application settings. A variable set with `name=value` is local to the shell; `export name=value` makes it available to programs you start. `PATH` is a colon-separated list of directories the shell searches for commands, in order, so installing a tool in a directory that is not on `PATH` makes it 'command not found' until you add it. `printenv` or `env` lists them. Persist settings in startup files such as `~/.bashrc` or `~/.profile`.",
    detail: [
      "`which cmd` or `command -v cmd` shows which executable would run.",
      "Services started by systemd do not read your shell profile; use `Environment=` instead.",
      "Never put secrets in shared startup files.",
    ],
    ex: '`export PATH="$HOME/.local/bin:$PATH"` makes tools installed there available.',
    mistakes: [
      "Forgetting export, so child programs do not see the variable.",
      "Overwriting PATH without keeping the old value.",
    ],
    follow: ["Why does a command work in your shell but not in cron?"],
    points: [
      "Variables inherited by children",
      "export shares them",
      "PATH lists command directories",
      "Startup files persist settings",
    ],
    notes: ["export to pass it on."],
    src: [
      ["GNU Bash manual: Environment", `${BASH}/Environment.html`],
      ["env(1)", `${MAN}/man1/env.1.html`],
    ],
  }),
  q({
    slug: "load-average-memory-uptime",
    topic: "Processes",
    d: "medium",
    title: "How do you check system load, memory and uptime on Linux?",
    kw: ["load average", "uptime", "free -h", "vmstat", "system health"],
    intent: "Checks you can do a quick health check of a server.",
    short:
      "`uptime` shows how long the system has been running and three load averages for the last 1, 5 and 15 minutes: the average number of processes that are running or waiting for the CPU (and on Linux also in uninterruptible I/O wait). A load consistently above the number of CPU cores suggests the system is overloaded. `free -h` shows total, used, free and available memory plus swap, and `available` is the useful figure because the kernel uses spare RAM for caches. `top` combines these views, and `df -h` checks disk space.",
    detail: [
      "Compare the load with the core count from `nproc` or `lscpu`.",
      "High load with low CPU use often means processes waiting on I/O.",
      "Rising swap use points to memory pressure.",
    ],
    ex: "A four-core server with a load average of 12 is overloaded, and `top` shows which process is responsible.",
    mistakes: [
      "Reading 'free' memory as the amount available.",
      "Judging load without knowing the core count.",
    ],
    follow: ["What do the three load numbers represent?"],
    points: [
      "uptime gives load averages",
      "Compare load with cores",
      "free -h: look at available",
      "Combine with top and df",
    ],
    notes: ["Load versus cores."],
    src: [
      ["uptime(1)", `${MAN}/man1/uptime.1.html`],
      ["free(1)", `${MAN}/man1/free.1.html`],
      ["top(1)", `${MAN}/man1/top.1.html`],
    ],
  }),
  q({
    slug: "globbing-vs-regex",
    topic: "Text processing",
    d: "medium",
    title:
      "What is the difference between shell wildcards (globs) and regular expressions?",
    kw: [
      "glob",
      "wildcards",
      "regular expressions",
      "filename expansion",
      "quoting",
    ],
    intent: "Checks you know which tool interprets which pattern.",
    short:
      "Globs are patterns the shell expands into file names before running a command: `*` matches any characters, `?` matches one character, and `[abc]` matches one of the listed characters, so `ls *.log` passes the matching names to `ls`. Regular expressions are patterns interpreted by programs such as `grep`, `sed` and `awk` to match text, where `.*` means any characters, `^` and `$` anchor lines, and `+` or `{n}` repeat. The same characters mean different things in each, so quote patterns meant for programs, otherwise the shell may expand them first.",
    detail: [
      "`grep '*.log' file` uses a regular expression, not a glob.",
      "Brace expansion `{a,b}` generates strings and is done by the shell.",
      "`set -f` disables globbing.",
    ],
    ex: "`grep -E 'error|warn' app.log` needs quotes so the shell does not treat the pipe character as a pipeline.",
    mistakes: [
      "Unquoted patterns expanded by the shell.",
      "Using glob syntax in grep.",
    ],
    follow: ["Who expands a glob, the shell or the program?"],
    points: [
      "Globs expand to file names in the shell",
      "Regexes match text inside programs",
      "Same characters, different meaning",
      "Quote patterns for programs",
    ],
    notes: ["Shell globs files, grep matches text."],
    src: [
      [
        "GNU Bash manual: Filename expansion",
        `${BASH}/Filename-Expansion.html`,
      ],
      ["grep(1)", `${MAN}/man1/grep.1.html`],
    ],
  }),
  q({
    slug: "archives-tar-gzip",
    topic: "Shell scripting",
    d: "easy",
    title: "How do you create and extract archives with tar and gzip?",
    kw: ["tar", "tar.gz", "gzip", "extract", "compress"],
    intent: "Checks you can package and unpack files.",
    short:
      "`tar` bundles many files into one archive, and with compression options it also shrinks them. Create a compressed archive with `tar -czf backup.tar.gz folder/` (c = create, z = gzip, f = file), list its contents with `tar -tzf backup.tar.gz`, and extract with `tar -xzf backup.tar.gz`, adding `-C /dest` to choose a destination. `gzip` compresses single files. Check an archive's contents before extracting an unknown one, since absolute paths or `..` entries can overwrite files, and remember that permissions and ownership are preserved in the archive.",
    detail: [
      "`.tgz` is another name for `.tar.gz`.",
      "Other compressors such as xz and bzip2 trade speed for size.",
      "`zip` and `unzip` are common for sharing with Windows users.",
    ],
    ex: "`tar -czf app-$(date +%F).tar.gz /srv/app` creates a dated backup.",
    mistakes: [
      "Extracting into the wrong directory.",
      "Putting the f option before the filename.",
    ],
    follow: ["What do the letters in czf mean?"],
    points: [
      "tar bundles, z compresses",
      "czf create, xzf extract, tzf list",
      "-C chooses the destination",
      "Inspect unknown archives",
    ],
    notes: ["c create, x extract, f file."],
    src: [["tar(1)", `${MAN}/man1/tar.1.html`]],
  }),
])
