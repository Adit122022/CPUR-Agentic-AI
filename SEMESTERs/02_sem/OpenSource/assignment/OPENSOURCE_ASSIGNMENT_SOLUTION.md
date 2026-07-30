# OPENSOURCE ASSIGNMENT SOLUTION

---

## Q1. Create Directory Structure using `mkdir`

```bash
mkdir -p /admin_tasks/logs
mkdir -p /admin_tasks/backups
mkdir -p /admin_tasks/scripts
```

**Verify the structure:**
```bash
tree /admin_tasks
# OR
find /admin_tasks -type d
```

**Expected Output:**
```
/admin_tasks
├── backups
├── logs
└── scripts
```

---

## Q2. Navigate into `scripts` and Create `cleanup.sh` using `touch`

```bash
cd /admin_tasks/scripts
touch cleanup.sh
```

**Verify:**
```bash
ls -l /admin_tasks/scripts/
```

---

## Q3. Assign Execute Permission to `cleanup.sh` Only for the Owner

```bash
chmod u+x /admin_tasks/scripts/cleanup.sh
```

**Verify:**
```bash
ls -l /admin_tasks/scripts/cleanup.sh
# Output: -rwxr--r-- or similar, with 'x' only for owner (u)
```

> **Explanation:**  
> `u+x` adds execute permission **only** for the file **owner** (user).  
> `g` = group, `o` = others — they remain unchanged.

---

## Q4. Create User `sysadmin` and Change Ownership of `logs` Directory

```bash
# Create the user
sudo useradd sysadmin

# Change ownership of the logs directory
sudo chown sysadmin /admin_tasks/logs
```

**Verify:**
```bash
ls -ld /admin_tasks/logs
# Output: drwxr-xr-x 2 sysadmin root 4096 ...
```

---

## Q5. Find All `.log` Files Inside `/var/log` and Copy to `logs` Directory

```bash
find /var/log -name "*.log" -exec cp {} /admin_tasks/logs/ \;
```

**Alternative (using xargs for efficiency):**
```bash
find /var/log -name "*.log" | xargs -I {} cp {} /admin_tasks/logs/
```

**Verify:**
```bash
ls /admin_tasks/logs/
```

---

## Q6. Archive the `backups` Directory into `backups.tar.gz`

```bash
tar -czvf backups.tar.gz /admin_tasks/backups
```

> **Flag Breakdown:**
> | Flag | Meaning |
> |------|---------|
> | `-c` | Create a new archive |
> | `-z` | Compress with gzip |
> | `-v` | Verbose (show files being archived) |
> | `-f` | Specifies the output filename |

**Verify:**
```bash
ls -lh backups.tar.gz
tar -tzvf backups.tar.gz   # List contents
```

---

## Q7. Check Disk Usage of `/home` and Save to `disk_report.txt`

```bash
du -sh /home > disk_report.txt
```

**For detailed output:**
```bash
du -ah /home > disk_report.txt
```

**Verify:**
```bash
cat disk_report.txt
```

> **Flag Breakdown:**  
> `-s` = summary total, `-h` = human-readable (KB/MB/GB), `-a` = all files

---

## Q8. Set Up a Symbolic Link from `cleanup.sh` to `/usr/local/bin/cleanup`

```bash
sudo ln -s /admin_tasks/scripts/cleanup.sh /usr/local/bin/cleanup
```

**Verify:**
```bash
ls -l /usr/local/bin/cleanup
# Output: lrwxrwxrwx 1 root root ... /usr/local/bin/cleanup -> /admin_tasks/scripts/cleanup.sh

# Test the link works:
which cleanup
cleanup   # If cleanup.sh has a valid shebang and content, it will execute
```

---

## Q9. File Permissions, Numeric/Symbolic Modes, and Sticky Bit

### Create `secure.txt` and Assign Permissions

**Using Symbolic Mode:**
```bash
touch secure.txt
chmod u=rw,g=r,o= secure.txt
```

**Using Numeric (Octal) Mode:**
```bash
chmod 640 secure.txt
```

> **Permission Breakdown for `640`:**
> | Entity | Permission | Octal |
> |--------|-----------|-------|
> | Owner  | read + write | 6 |
> | Group  | read only    | 4 |
> | Others | no permission | 0 |

**Verify:**
```bash
ls -l secure.txt
# Output: -rw-r----- 1 user group ... secure.txt
```

---

### Set Sticky Bit on a Directory

```bash
# Create a shared directory (example)
mkdir /admin_tasks/shared

# Set sticky bit using symbolic mode
chmod +t /admin_tasks/shared

# OR using numeric mode
chmod 1755 /admin_tasks/shared
```

**Verify:**
```bash
ls -ld /admin_tasks/shared
# Output: drwxr-xr-t 2 root root 4096 ...  ← 't' at the end = sticky bit set
```

> **What is the Sticky Bit?**  
> When set on a directory, only the **file owner**, the **directory owner**, or **root** can delete or rename files inside it — even if others have write permission. Commonly used on `/tmp`.

---

## Q10. One-Line Command: Backup `/lab_pg`, Compress, Append Date, Store in `/lab_pg/logs`

```bash
tar -czvf /lab_pg/logs/backup_$(date +%Y-%m-%d).tar.gz /lab_pg --exclude=/lab_pg/logs
```

> **Breakdown:**
> | Part | Purpose |
> |------|---------|
> | `tar -czvf` | Create compressed verbose archive |
> | `/lab_pg/logs/backup_$(date +%Y-%m-%d).tar.gz` | Output path with date appended (e.g., `backup_2025-06-01.tar.gz`) |
> | `/lab_pg` | Source directory to back up |
> | `--exclude=/lab_pg/logs` | Avoid backing up the logs folder itself (prevents recursion) |

**Example output filename:** `backup_2025-06-01.tar.gz`

---

## Q11. Difference Between Hard Link and Soft (Symbolic) Link

### Conceptual Difference

| Feature | Hard Link | Soft (Symbolic) Link |
|---------|-----------|----------------------|
| Points to | Inode (actual data) | File path/name |
| Works across filesystems | ❌ No | ✅ Yes |
| Valid after original deleted | ✅ Yes (data still accessible) | ❌ No (broken link) |
| Can link directories | ❌ No (usually) | ✅ Yes |
| Shows as | Same inode number | Different inode, shows `->` |
| Created with | `ln source link` | `ln -s source link` |

---

### Demonstration

```bash
# Create an original file
echo "Hello from original" > original.txt

# Create a HARD LINK
ln original.txt hardlink.txt

# Create a SOFT LINK
ln -s original.txt softlink.txt

# Check inodes
ls -li original.txt hardlink.txt softlink.txt
```

**Sample Output:**
```
1234567 -rw-r--r-- 2 user user 20 Jun  1 10:00 original.txt
1234567 -rw-r--r-- 2 user user 20 Jun  1 10:00 hardlink.txt   ← same inode!
1234568 lrwxrwxrwx 1 user user 12 Jun  1 10:00 softlink.txt -> original.txt
```

```bash
# Delete the original file
rm original.txt

# Hard link still works (data preserved)
cat hardlink.txt
# Output: Hello from original

# Soft link is now BROKEN
cat softlink.txt
# Output: cat: softlink.txt: No such file or directory
```

---

## Q12. Process States in Linux

A Linux process can be in one of the following states:

| State | Code | Description |
|-------|------|-------------|
| **Running** | `R` | Currently executing on CPU or in run queue |
| **Sleeping (Interruptible)** | `S` | Waiting for an event (e.g., I/O); can be interrupted by a signal |
| **Sleeping (Uninterruptible)** | `D` | Waiting for I/O; cannot be interrupted by signals (e.g., disk read) |
| **Stopped** | `T` | Halted by a signal (e.g., `SIGSTOP`) or being traced by a debugger |
| **Zombie** | `Z` | Process finished, but parent hasn't read its exit status yet |
| **Dead** | `X` | Process is fully terminated and being removed |

### Process State Diagram

```
     [Created / Fork]
           |
           v
       [Ready/R]  <----> [Running/R]
                              |
              +---------------+---------------+
              |               |               |
        [Sleeping/S]    [Stopped/T]     [Zombie/Z]
        (I/O wait)      (SIGSTOP)       (parent not wait()-ed)
              |
        [Uninterruptible/D]
        (critical I/O)
```

**Check process states:**
```bash
ps aux        # Shows all processes with states
top           # Interactive view with states
```

---

## Q13. Difference Between `cron` and `at`

| Feature | `cron` | `at` |
|---------|--------|------|
| **Type** | Recurring/scheduled | One-time execution |
| **Use case** | Tasks that repeat (daily, weekly) | Tasks that run once at a specific time |
| **Config file** | `/etc/crontab` or `crontab -e` | Entered via `at` command prompt |
| **Daemon** | `crond` | `atd` |
| **Syntax** | `* * * * * command` (min hr dom mon dow) | `at 10:30 AM` then enter command |
| **Persistent** | ✅ Survives reboot | ✅ Survives reboot (stored in spool) |
| **Best for** | Log rotation, backups, cleanup scripts | One-time maintenance, delayed sends |

### `cron` Example

```bash
crontab -e

# Run cleanup.sh every day at 2:30 AM
30 2 * * * /admin_tasks/scripts/cleanup.sh

# Run every Monday at 9 AM
0 9 * * 1 /usr/local/bin/cleanup
```

### `at` Example

```bash
# Schedule a command to run at 5:00 PM today
at 5:00 PM
> echo "Backup complete" >> /var/log/backup.log
> <Ctrl+D>

# List scheduled at jobs
atq

# Remove a job (e.g., job #3)
atrm 3
```

---

## Q14. Create User `pgstudent`, Assign Password, Create Group `research`, Add User, Restrict Directory

```bash
# Step 1: Create the user
sudo useradd pgstudent

# Step 2: Assign a password
sudo passwd pgstudent
# (Enter and confirm the password when prompted)

# Step 3: Create the group 'research'
sudo groupadd research

# Step 4: Add pgstudent to the research group
sudo usermod -aG research pgstudent

# Step 5: Create a restricted directory for the group
sudo mkdir /research_data

# Step 6: Change group ownership to 'research'
sudo chgrp research /research_data

# Step 7: Set permissions — owner full, group read/write/execute, others none
sudo chmod 770 /research_data
```

**Verify:**
```bash
ls -ld /research_data
# Output: drwxrwx--- 2 root research 4096 ...

groups pgstudent
# Output: pgstudent : pgstudent research
```

> **Result:** Only members of the `research` group can access `/research_data`. Others have no permissions.

---

## Q15. Process Management — List, Monitor, Background, Foreground, Kill

### List All Running Processes of Current User

```bash
ps -u $(whoami)
# OR
ps aux | grep $(whoami)
```

---

### Identify Top 5 CPU-Consuming Processes

```bash
ps aux --sort=-%cpu | head -6
# (head -6 to include header + 5 processes)
```

**Using `top` interactively:**
```bash
top
# Press 'P' to sort by CPU
# Press 'q' to quit
```

---

### Start a Background Process using `sleep 500`

```bash
sleep 500 &
# Output: [1] 12345   ← [job_number] PID
```

---

### Bring Background Process to Foreground

```bash
# List background jobs
jobs
# Output: [1]+  Running    sleep 500 &

# Bring job [1] to foreground
fg %1
```

---

### Kill the Process

**Method 1 — Kill by PID:**
```bash
# Find PID of sleep 500
ps aux | grep "sleep 500"

# Kill using PID (e.g., PID = 12345)
kill 12345

# Force kill if needed
kill -9 12345
```

**Method 2 — Kill by Process Name:**
```bash
pkill sleep
# OR
killall sleep
```

**Verify it's gone:**
```bash
ps aux | grep sleep
```

---

## Q16. Change the Group of `myscript` (Created by `pgstudent`) to User "BCA581"

> **Note:** In Linux, `chgrp` changes the **group** of a file, not the user. To change the group to `BCA581`, `BCA581` must exist as a **group**.

### Step 1: Create group `BCA581` (if not already existing)

```bash
sudo groupadd BCA581
```

### Step 2: Change the group of `myscript` to `BCA581`

```bash
sudo chgrp BCA581 /home/pgstudent/myscript
```

**OR using `chown` (change both owner and group):**
```bash
# Change only group
sudo chown :BCA581 /home/pgstudent/myscript
```

### Verify:

```bash
ls -l /home/pgstudent/myscript
# Output: -rw-r--r-- 1 pgstudent BCA581 ... myscript
#                                 ^^^^^^ group is now BCA581
```

> **Note:** Only **root** or the **file owner** (pgstudent) can change the group, and only to a group they belong to (unless root).

---

*End of Assignment Solutions*
