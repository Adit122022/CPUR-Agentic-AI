# 📚 Linux Assignment — Hinglish Teaching Guide
### *Samjho, Seekho, Karo!*

> Yeh README ek **teaching guide** hai. Pehle **question explain** karunga ki karna kya hai, phir **answer** dunga, aur phir **har command ko tod ke** bataunga ki woh exactly kya karta hai. Chalo shuru karte hain! 🚀

---

## 📌 Table of Contents

1. [Directory Structure Banana](#q1-directory-structure-banana)
2. [Script File Banana](#q2-script-file-banana)
3. [Execute Permission Dena](#q3-execute-permission-dena)
4. [User Banana aur Ownership Change Karna](#q4-user-banana-aur-ownership-change-karna)
5. [Log Files Dhundh ke Copy Karna](#q5-log-files-dhundh-ke-copy-karna)
6. [Directory ko Archive Karna](#q6-directory-ko-archive-karna)
7. [Disk Usage Check Karna](#q7-disk-usage-check-karna)
8. [Symbolic Link Banana](#q8-symbolic-link-banana)
9. [File Permissions aur Sticky Bit](#q9-file-permissions-aur-sticky-bit)
10. [One-Line Backup Command](#q10-one-line-backup-command)
11. [Hard Link vs Soft Link](#q11-hard-link-vs-soft-link)
12. [Process States in Linux](#q12-process-states-in-linux)
13. [Cron vs At](#q13-cron-vs-at)
14. [User, Group, aur Directory Restriction](#q14-user-group-aur-directory-restriction)
15. [Process Management](#q15-process-management)
16. [File ka Group Change Karna](#q16-file-ka-group-change-karna)

---

## Q1. Directory Structure Banana

### 🤔 Yeh Question Kya Bol Raha Hai?

Imagine karo tumhare computer mein ek **admin_tasks** naam ka folder banana hai, aur us folder ke andar 3 aur folders banane hain:
- `logs` → logs store honge yahan
- `backups` → backups store honge yahan
- `scripts` → scripts store honge yahan

Real life example: Jaise ghar mein alag-alag almariyan hoti hain — kapdon ke liye alag, kitabon ke liye alag — waise hi folders mein data organize karte hain.

Structure kuch aisa dikhna chahiye:
```
/admin_tasks
├── logs
├── backups
└── scripts
```

### ✅ Answer

```bash
mkdir -p /admin_tasks/logs
mkdir -p /admin_tasks/backups
mkdir -p /admin_tasks/scripts
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `mkdir` | **Make Directory** — naya folder banao |
| `-p` | **Parents** — agar beech ke folders nahi hain toh unhe bhi automatically bana do. Agar `/admin_tasks` exist nahi karta, toh pehle woh bnega, phir `logs` banega |
| `/admin_tasks/logs` | Yeh woh path hai jahan folder banana hai |

**Verify karo (check karo ki bana ya nahi):**
```bash
ls /admin_tasks
# Output: backups  logs  scripts
```

---

## Q2. Script File Banana

### 🤔 Yeh Question Kya Bol Raha Hai?

Ab `scripts` folder ke andar jaana hai aur wahan ek **shell script file** banani hai jiska naam `cleanup.sh` ho.

`.sh` extension matlab yeh ek **shell script** file hai — isme commands likhte hain jo automatically run hoti hain.

`touch` command se **empty file** banti hai — jaise ek blank kagaz lena.

### ✅ Answer

```bash
cd /admin_tasks/scripts
touch cleanup.sh
```

### 🔍 Command Breakdown

**Pehli command:**
| Part | Matlab |
|------|--------|
| `cd` | **Change Directory** — us folder mein jaao |
| `/admin_tasks/scripts` | Yeh woh folder hai jahan jaana hai |

**Doosri command:**
| Part | Matlab |
|------|--------|
| `touch` | Ek nayi **khali file** banao (ya existing file ka timestamp update karo) |
| `cleanup.sh` | File ka naam |

**Verify karo:**
```bash
ls -l /admin_tasks/scripts/
# Output: -rw-r--r-- 1 root root 0 ... cleanup.sh
```

---

## Q3. Execute Permission Dena

### 🤔 Yeh Question Kya Bol Raha Hai?

Linux mein har file ke 3 tarah ke **permissions** hote hain:
- **r** = read (padhna)
- **w** = write (likhna/badalna)
- **x** = execute (chalana)

Aur yeh permissions **3 logo ke liye** hoti hain:
- **u** = user/owner (jisne file banai)
- **g** = group (ek group of users)
- **o** = others (baki sab)

Question bol raha hai: `cleanup.sh` ko **sirf owner** ke liye **chalane ki permission** do. Group aur others ko execute nahi karna chahiye.

### ✅ Answer

```bash
chmod u+x /admin_tasks/scripts/cleanup.sh
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `chmod` | **Change Mode** — file ki permissions badlo |
| `u` | **User/Owner** — sirf file ke owner ke liye |
| `+` | Permission **add karo** (`-` hota toh remove hota) |
| `x` | **Execute** permission — file ko run karne ki permission |
| `/admin_tasks/scripts/cleanup.sh` | Kis file ki permission badalni hai |

**Verify karo:**
```bash
ls -l /admin_tasks/scripts/cleanup.sh
# Output: -rwxr--r-- 1 root root 0 ... cleanup.sh
#           ^           ← 'x' sirf owner ke liye hai (pehle 3 characters)
```

---

## Q4. User Banana aur Ownership Change Karna

### 🤔 Yeh Question Kya Bol Raha Hai?

Linux ek **multi-user** system hai — matlab ek hi computer pe kaafi log kaam kar sakte hain, sab ke apne alag accounts hote hain.

Do kaam karne hain:
1. `sysadmin` naam ka ek **naya user** banao
2. `logs` directory ka **owner** change karo — abhi jo bhi owner hai uski jagah `sysadmin` ko owner banao

Real life: Jaise office mein ek nayi employee aati hai aur usse ek particular filing cabinet ki responsibility di jaati hai.

### ✅ Answer

```bash
sudo useradd sysadmin
sudo chown sysadmin /admin_tasks/logs
```

### 🔍 Command Breakdown

**Pehli command:**
| Part | Matlab |
|------|--------|
| `sudo` | **Super User Do** — admin/root ki tarah command chalao |
| `useradd` | Naya **user account** banao |
| `sysadmin` | Nayi user ka naam |

**Doosri command:**
| Part | Matlab |
|------|--------|
| `sudo` | Admin permission se chalao |
| `chown` | **Change Owner** — file/folder ka malik badlo |
| `sysadmin` | Naya owner ka naam |
| `/admin_tasks/logs` | Kiska owner badalna hai |

**Verify karo:**
```bash
ls -ld /admin_tasks/logs
# Output: drwxr-xr-x 2 sysadmin root 4096 ... /admin_tasks/logs
#                      ^^^^^^^^ ← ab sysadmin owner hai
```

---

## Q5. Log Files Dhundh ke Copy Karna

### 🤔 Yeh Question Kya Bol Raha Hai?

`/var/log` ek system folder hai jahan Linux apne **saare log files** store karta hai (errors, events, etc.). Tumhe us folder ke andar ghus ke **saari `.log` files dhundni hain** (chahe kitni bhi subfolders mein ho) aur unhe `/admin_tasks/logs/` mein copy karna hai.

Yahan **`find`** command use karenge jo poore folder mein search karti hai.

### ✅ Answer

```bash
find /var/log -name "*.log" -exec cp {} /admin_tasks/logs/ \;
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `find` | Files dhundho |
| `/var/log` | **Kahan** dhundna hai — yeh starting folder hai |
| `-name "*.log"` | **Naam ka pattern** — `*.log` matlab jo bhi file `.log` pe khatam ho. `*` ek wildcard hai (koi bhi naam) |
| `-exec` | Jo file mili, us pe **yeh command chalao** |
| `cp` | **Copy** karo |
| `{}` | Yeh ek **placeholder** hai — jahan-jahan `{}` hai, wahan mili hui file ka naam aa jaata hai automatically |
| `/admin_tasks/logs/` | **Kahan copy** karni hai |
| `\;` | `-exec` command ka **end** — batata hai ki command khatam ho gayi |

**Verify karo:**
```bash
ls /admin_tasks/logs/
```

---

## Q6. Directory ko Archive Karna

### 🤔 Yeh Question Kya Bol Raha Hai?

`backups` directory ko ek **single compressed file** mein pack karo — jaise saaman ko ek dabba mein band karna aur usse vacuum se compress karna taaki jagah kam le.

Output file: `backups.tar.gz`
- `.tar` = kai files ko ek mein combine karna
- `.gz` = gzip compression se compress karna

### ✅ Answer

```bash
tar -czvf backups.tar.gz /admin_tasks/backups
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `tar` | **Tape Archive** — files ko pack/unpack karne ka tool |
| `-c` | **Create** — naya archive banao |
| `-z` | **Gzip compression** use karo (`.gz` extension isi liye) |
| `-v` | **Verbose** — process karte time files ke naam screen pe dikhao |
| `-f` | **File** — agle argument mein archive ka naam batao |
| `backups.tar.gz` | Output file ka naam |
| `/admin_tasks/backups` | Kaunse folder ko archive karna hai |

**Verify karo:**
```bash
ls -lh backups.tar.gz
# Output: -rw-r--r-- 1 root root 512 ... backups.tar.gz

tar -tzvf backups.tar.gz   # Contents dekho bina extract kiye
```

---

## Q7. Disk Usage Check Karna

### 🤔 Yeh Question Kya Bol Raha Hai?

`/home` directory kitni **jagah le rahi hai** hard disk pe — yeh check karo, aur us information ko ek file mein save karo jiska naam `disk_report.txt` ho.

Real life: Jaise phone ki settings mein jaake storage check karte ho ki kaunsa app kitna space le raha hai.

### ✅ Answer

```bash
du -sh /home > disk_report.txt
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `du` | **Disk Usage** — folder kitna space le raha hai |
| `-s` | **Summary** — sirf total dikhao, andar ki har file nahi |
| `-h` | **Human-readable** — `1024` ki jagah `1K`, `5242880` ki jagah `5M` dikhao |
| `/home` | Kaunsi directory check karni hai |
| `>` | **Redirect** — command ka output screen pe nahi, **file mein save** karo |
| `disk_report.txt` | Jis file mein save karna hai |

**Verify karo:**
```bash
cat disk_report.txt
# Output: 1.2G    /home
```

> 💡 **Tip:** `>` se file overwrite hoti hai. `>>` use karo agar existing file mein **add** karna ho.

---

## Q8. Symbolic Link Banana

### 🤔 Yeh Question Kya Bol Raha Hai?

Ek **symbolic link (symlink)** basically ek **shortcut** hota hai — jaise Windows mein desktop pe shortcut banate ho kisi program ka.

Yahan chahte hain: `/usr/local/bin/cleanup` ek shortcut ho jo actually `/admin_tasks/scripts/cleanup.sh` ko point kare.

Fayda: `/usr/local/bin/` system ke `PATH` mein hota hai, toh bas `cleanup` type karne se script run ho jaayegi — puri path type nahi karni padegi.

### ✅ Answer

```bash
sudo ln -s /admin_tasks/scripts/cleanup.sh /usr/local/bin/cleanup
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `sudo` | Admin permission se chalao |
| `ln` | **Link** banao |
| `-s` | **Symbolic** link banao (bina `-s` ke hard link banta, jo alag cheez hai) |
| `/admin_tasks/scripts/cleanup.sh` | **Source** — asli file kahan hai (jahan shortcut point karega) |
| `/usr/local/bin/cleanup` | **Destination** — shortcut kahan banaana hai, aur uska naam kya hoga |

**Verify karo:**
```bash
ls -l /usr/local/bin/cleanup
# Output: lrwxrwxrwx 1 root root 35 ... /usr/local/bin/cleanup -> /admin_tasks/scripts/cleanup.sh
#         ^                              ← 'l' matlab link hai
#                                                                  ^^^ yeh batata hai kahan point kar raha hai
```

---

## Q9. File Permissions aur Sticky Bit

### 🤔 Yeh Question Kya Bol Raha Hai?

Teen cheezein karni hain:

**Pehli:** `secure.txt` file banao aur uski permissions set karo:
- Owner → padhna + likhna (read + write)
- Group → sirf padhna (read only)
- Others → kuch nahi (no permission)

**Doosri:** Yahi kaam **do tareekon** se karo — symbolic mode (letters se) aur numeric mode (numbers se)

**Teesri:** Ek directory pe **sticky bit** lagao

### ✅ Answer

**Symbolic mode se:**
```bash
touch secure.txt
chmod u=rw,g=r,o= secure.txt
```

**Numeric mode se (same result):**
```bash
chmod 640 secure.txt
```

### 🔍 Numeric Mode Samjho — Octal Permission Table

Yeh **3-digit number** hota hai jahan har digit ek entity ke liye hoti hai:

```
chmod 640 secure.txt
       ^^^
       |||
       ||+-- Others (0 = koi permission nahi)
       |+--- Group  (4 = sirf read)
       +---- Owner  (6 = read + write)
```

Har number ka matlab:

| Number | Permission | Calculation |
|--------|-----------|-------------|
| **7** | rwx (sab kuch) | 4+2+1 |
| **6** | rw- (read+write) | 4+2 |
| **5** | r-x (read+execute) | 4+1 |
| **4** | r-- (sirf read) | 4 |
| **2** | -w- (sirf write) | 2 |
| **1** | --x (sirf execute) | 1 |
| **0** | --- (kuch nahi) | 0 |

> 💡 Yaad karo: **r=4, w=2, x=1** — bas inhe jod do!

---

### Sticky Bit Set Karna

**Sticky bit kya hai?** Jab koi shared directory hoti hai jisme bahut saare log kaam karte hain, toh sticky bit lagane pe **sirf file ka owner** apni file delete kar sakta hai — chahe doosron ko write permission ho.

Example: `/tmp` folder pe sticky bit hoti hai taaki koi doosre ka data na delete kare.

```bash
mkdir /admin_tasks/shared
chmod +t /admin_tasks/shared        # Symbolic mode
# YA
chmod 1755 /admin_tasks/shared     # Numeric mode (1 = sticky bit)
```

**Verify karo:**
```bash
ls -ld /admin_tasks/shared
# Output: drwxr-xr-t 2 root root 4096 ...
#                  ^  ← 't' matlab sticky bit laga hai!
```

---

## Q10. One-Line Backup Command

### 🤔 Yeh Question Kya Bol Raha Hai?

Ek aisi **single line command** likhni hai jo:
1. `/lab_pg` ka backup le
2. Use compress kare
3. File ke naam mein **aaj ki date** automatically jod de
4. Use `/lab_pg/logs/` mein save kare

**No script file allowed** — matlab koi `.sh` file nahi, seedha terminal mein ek command.

### ✅ Answer

```bash
tar -czvf /lab_pg/logs/backup_$(date +%Y-%m-%d).tar.gz /lab_pg --exclude=/lab_pg/logs
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `tar -czvf` | Archive banao, compress karo, verbose show karo, file naam batao |
| `/lab_pg/logs/` | **Kahan save** karna hai |
| `backup_` | File naam ka pehla hissa (sirf text) |
| `$(date +%Y-%m-%d)` | **Command substitution** — `$()` ke andar jo bhi command hai, uska output yahan paste ho jaata hai. `date +%Y-%m-%d` aaj ki date deta hai jaise `2025-06-01` |
| `.tar.gz` | File extension |
| `/lab_pg` | **Source** — kaunsa folder backup karna hai |
| `--exclude=/lab_pg/logs` | `logs` folder ko backup se **bahar rakho** — warna backup apne aap ko backup karne lage! (infinite loop) |

**Example output filename:** `backup_2025-06-01.tar.gz`

---

## Q11. Hard Link vs Soft Link

### 🤔 Yeh Question Kya Bol Raha Hai?

Dono ek file ke "shortcuts" jaisi cheezein hain, lekin kaam alag-alag tarah karte hain. Question mein dono ka **fark batana hai** aur **demonstrate karna hai** — matlab actually commands chalake dikhana hai.

### 📖 Concept Pehle Samjho

Socho ek file ek **almirah mein rakha hua document** hai:

- **Hard Link** = us document ki **photocopy** jo same shelf pe rakhi hai — original nikalo toh bhi copy kaam karti hai
- **Soft Link** = ek **chit** jisme likha hai "document almirah number 5 mein hai" — almirah khali ho gayi toh chit bekaar ho jaati hai

| Feature | Hard Link | Soft Link |
|---------|-----------|-----------|
| Points to | Asli data (inode) | File ka path/naam |
| Original delete hone ke baad | ✅ Kaam karta rehta hai | ❌ Toot jaata hai (broken link) |
| Different filesystem pe | ❌ Nahi ho sakta | ✅ Ho sakta hai |
| Directory ke liye | ❌ Nahi | ✅ Haan |
| Kaise pehchano | Same inode number | `ls -l` mein `->` dikhta hai |

### ✅ Answer — Demonstration

```bash
# Step 1: Ek original file banao
echo "Hello from original" > original.txt

# Step 2: Hard link banao
ln original.txt hardlink.txt

# Step 3: Soft link banao
ln -s original.txt softlink.txt

# Step 4: Inode numbers dekho
ls -li original.txt hardlink.txt softlink.txt
```

**Expected output:**
```
1234567 -rw-r--r-- 2 user user 20 ... original.txt
1234567 -rw-r--r-- 2 user user 20 ... hardlink.txt  ← same inode! (1234567)
1234568 lrwxrwxrwx 1 user user 12 ... softlink.txt -> original.txt
```

```bash
# Step 5: Original delete karo
rm original.txt

# Hard link abhi bhi kaam karta hai
cat hardlink.txt
# Output: Hello from original  ✅

# Soft link toot gaya
cat softlink.txt
# Output: cat: softlink.txt: No such file or directory  ❌
```

### 🔍 Command Breakdown

| Part | Matlab |
|------|--------|
| `ln original.txt hardlink.txt` | `original.txt` ka **hard link** banao naam `hardlink.txt` |
| `ln -s original.txt softlink.txt` | `-s` flag se **symbolic/soft link** banao |
| `ls -li` | `-l` = detailed list, `-i` = **inode number** bhi dikhao |

---

## Q12. Process States in Linux

### 🤔 Yeh Question Kya Bol Raha Hai?

Linux mein jab koi program run hota hai toh woh ek **process** ban jaata hai. Har process kisi ek **state** mein hoti hai — jaise insaan ya toh kaam kar raha hai, ya so raha hai, ya ruk gaya hai.

Question mein yeh batana hai ki Linux mein kaun-kaun si process states hoti hain aur unka kya matlab hota hai.

### 📖 Process States

```
[Naya Process Bana]
        |
        v
   [Ready — R]  <──────────────────────┐
        |                              |
        v                              |
  [Running — R]  ──────── CPU milta hai / chhin jaata hai
        |
   ┌────┼────────────────┐
   |    |                |
   v    v                v
[S]   [D]             [T]           [Z]
Soft  Hard           Stopped       Zombie
Sleep Sleep         (ruka hua)  (khatam lekin
(I/O) (I/O)                      parent ne
                                  acknowledge
                                  nahi kiya)
```

| State | Code | Kab hoti hai | Real-life Example |
|-------|------|--------------|-------------------|
| **Running** | `R` | CPU pe chal raha hai ya run ke liye ready hai | Student exam de raha hai |
| **Sleeping (Interruptible)** | `S` | Kisi event ka wait kar raha hai, interrupt ho sakta hai | Student results ka wait kar raha hai, call aane pe uth sakta hai |
| **Sleeping (Uninterruptible)** | `D` | Disk I/O ka wait kar raha hai, interrupt NAHI ho sakta | Student critical operation mein hai, rokna dangerous hai |
| **Stopped** | `T` | Kisi signal se rok diya gaya | Student ko break pe bheja gaya |
| **Zombie** | `Z` | Process khatam ho gayi lekin parent process ne abhi acknowledge nahi kiya | Student pass ho gaya lekin result officially declare nahi hua |

**Check karo:**
```bash
ps aux
# 'STAT' column mein state dikhti hai

top
# Har process ki state live dikhti hai
```

---

## Q13. Cron vs At

### 🤔 Yeh Question Kya Bol Raha Hai?

Dono scheduling tools hain — inka kaam hai koi command/script **automatically chalana** ek specific time pe. Lekin dono ka use case alag hai.

**Simple analogy:**
- **Cron** = Phone ka **recurring alarm** — "Har roz subah 7 baje bajao"
- **At** = Ek baar ki **reminder** — "Aaj shaam 5 baje remind karo"

### 📖 Comparison

| Feature | `cron` | `at` |
|---------|--------|------|
| **Kab use karo** | Bar-bar repeat hone wale kaam | Ek baar ka kaam |
| **Examples** | Daily backup, weekly cleanup | Ek baar ka server restart |
| **Config kahan** | `crontab -e` se edit karo | Command line pe type karo |
| **Daemon** | `crond` background mein chalta hai | `atd` background mein chalta hai |

### ✅ Cron Example

```bash
crontab -e
```

Phir yeh likhte hain:
```
30 2 * * * /admin_tasks/scripts/cleanup.sh
```

**Cron Format Breakdown:**
```
┌───── Minute (0-59)
│ ┌─── Hour (0-23)
│ │ ┌─ Day of Month (1-31)
│ │ │ ┌ Month (1-12)
│ │ │ │ ┌ Day of Week (0=Sunday, 6=Saturday)
│ │ │ │ │
30 2 * * *   /path/to/command
```

Upar wali line ka matlab: "Har din raat 2:30 baje `cleanup.sh` chalao"

`*` ka matlab = "har" (every)

### ✅ At Example

```bash
at 5:00 PM
> echo "Backup complete" >> /var/log/backup.log
> Ctrl+D   ← press karo save karne ke liye
```

```bash
atq          # Pending jobs dekho
atrm 3       # Job number 3 cancel karo
```

---

## Q14. User, Group, aur Directory Restriction

### 🤔 Yeh Question Kya Bol Raha Hai?

Yeh ek complete **user management** task hai:
1. `pgstudent` naam ka user banao
2. Usse password do
3. `research` naam ka group banao
4. `pgstudent` ko us group mein add karo
5. Ek aisi directory banao jisme **sirf research group ke members** ghus sakein — baaki koi nahi

Real life: Company mein HR team ke liye alag restricted folder hota hai — sirf HR log hi dekh sakte hain.

### ✅ Answer

```bash
# 1. User banao
sudo useradd pgstudent

# 2. Password do
sudo passwd pgstudent
# (Password type karo jab pooche — screen pe nahi dikhega, normal hai)

# 3. Group banao
sudo groupadd research

# 4. User ko group mein add karo
sudo usermod -aG research pgstudent

# 5. Restricted directory banao
sudo mkdir /research_data

# 6. Directory ka group change karo
sudo chgrp research /research_data

# 7. Permissions set karo
sudo chmod 770 /research_data
```

### 🔍 Command Breakdown

**`usermod -aG research pgstudent`:**
| Part | Matlab |
|------|--------|
| `usermod` | **User modify** — existing user ki settings badlo |
| `-a` | **Append** — existing groups ke saath naya group **add** karo (agar `-a` nahi likha toh saare purane groups hat jaate hain!) |
| `-G` | **Groups** — kaunse group mein add karna hai |
| `research` | Group ka naam |
| `pgstudent` | Kaunse user ki setting badalni hai |

**`chmod 770 /research_data`:**
```
7 7 0
^ ^ ^
| | +-- Others: koi permission nahi (000)
| +---- Group: rwx (read + write + execute = 7)
+------ Owner: rwx (read + write + execute = 7)
```

**Verify karo:**
```bash
ls -ld /research_data
# Output: drwxrwx--- 2 root research 4096 ...
#                ^^^ ← group ko full access, others ko kuch nahi

groups pgstudent
# Output: pgstudent : pgstudent research
```

---

## Q15. Process Management

### 🤔 Yeh Question Kya Bol Raha Hai?

Yeh ek practical process management task hai. Seekhna hai:
- Apne user ke saare running processes kaise dekhen
- Sabse zyada CPU use karne wale processes kaise pata karo
- Koi process **background** mein kaise chalao
- Background process ko **foreground** mein kaise lao
- Process kaise **band (kill)** karo — ID se bhi aur naam se bhi

### ✅ Answer — Step by Step

**Step 1: Apne user ke saare processes dekho**
```bash
ps -u $(whoami)
```

| Part | Matlab |
|------|--------|
| `ps` | **Process Status** — running processes dikhaao |
| `-u` | Specific user ke processes |
| `$(whoami)` | `whoami` command tera username print karta hai, `$()` us output ko yahan paste kar deta hai |

---

**Step 2: Top 5 CPU consuming processes**
```bash
ps aux --sort=-%cpu | head -6
```

| Part | Matlab |
|------|--------|
| `ps aux` | **a** = sab users ke processes, **u** = user-friendly format, **x** = terminal ke bina wale bhi |
| `--sort=-%cpu` | CPU usage ke hisaab se sort karo, `-` matlab descending (sabse zyada pehle) |
| `\|` | **Pipe** — pehli command ka output doosri command ko bhejo |
| `head -6` | Sirf pehli **6 lines** dikhaao (1 header + 5 processes) |

---

**Step 3: Background mein process start karo**
```bash
sleep 500 &
# Output: [1] 12345
#          ^   ^
#          |   +-- PID (Process ID)
#          +------ Job number
```

| Part | Matlab |
|------|--------|
| `sleep 500` | 500 seconds tak kuch nahi karo (sirf wait karo) — yeh test ke liye use karte hain |
| `&` | Ampersand matlab "background mein chalao" — terminal free rehta hai |

---

**Step 4: Background process ko foreground mein lao**
```bash
jobs          # Pehle dekho ki kaun kaun se background jobs hain
fg %1         # Job number 1 ko foreground mein lao
```

| Part | Matlab |
|------|--------|
| `jobs` | Saare **background jobs** list karo |
| `fg` | **Foreground** — background se foreground mein lao |
| `%1` | Job number 1 (jobs command mein `[1]` dikhta tha) |

---

**Step 5: Process Kill karo**

**Method A — PID se:**
```bash
ps aux | grep "sleep 500"   # PID pata karo (doosra column)
kill 12345                   # Normal kill (graceful)
kill -9 12345                # Force kill (stubborn process ke liye)
```

**Method B — Naam se:**
```bash
pkill sleep      # Process naam se kill
killall sleep    # Isi naam ke saare processes kill
```

| Command | Matlab |
|---------|--------|
| `kill 12345` | Process ID 12345 ko **gracefully** band karo (process ko cleanup ka mauka deta hai) |
| `kill -9 12345` | **Force kill** — seedha process ko terminate karo, koi chance nahi deta |
| `pkill sleep` | `sleep` naam wale process ko kill karo |
| `killall sleep` | `sleep` naam ke **saare** processes kill karo |

---

## Q16. File ka Group Change Karna

### 🤔 Yeh Question Kya Bol Raha Hai?

`pgstudent` user ne ek file banai hai jiska naam `myscript` hai. Ab us file ka **group** change karna hai — current group ki jagah `BCA581` group karna hai.

Note: Linux mein **user aur group alag hote hain**. `chgrp` command sirf **group** change karta hai, owner nahi.

### ✅ Answer

```bash
# Pehle group 'BCA581' exist karna chahiye (agar nahi hai toh banao)
sudo groupadd BCA581

# Ab file ka group change karo
sudo chgrp BCA581 /home/pgstudent/myscript
```

### 🔍 Command Breakdown

**`chgrp BCA581 /home/pgstudent/myscript`:**
| Part | Matlab |
|------|--------|
| `chgrp` | **Change Group** — file ka group badlo |
| `BCA581` | Naye group ka naam |
| `/home/pgstudent/myscript` | Kaunsi file ka group change karna hai |

**Alternative — `chown` se bhi kar sakte hain:**
```bash
sudo chown :BCA581 /home/pgstudent/myscript
#           ^ colon pehle = sirf group change karo, owner nahi
```

**Verify karo:**
```bash
ls -l /home/pgstudent/myscript
# Output: -rw-r--r-- 1 pgstudent BCA581 ... myscript
#                                ^^^^^^ ← group ab BCA581 hai!
```

> ⚠️ **Important Note:** Yeh kaam sirf **root (sudo)** ya **file ka owner** kar sakta hai, aur owner sirf wohi group set kar sakta hai jisme woh khud ho.

---

## 🎯 Quick Revision — Sabse Important Commands

| Kaam | Command |
|------|---------|
| Folder banao | `mkdir -p /path/folder` |
| Khali file banao | `touch filename` |
| Permission change karo | `chmod 755 file` ya `chmod u+x file` |
| Owner change karo | `chown user file` |
| Group change karo | `chgrp group file` |
| User banao | `useradd username` |
| Password do | `passwd username` |
| Group banao | `groupadd groupname` |
| User ko group mein add karo | `usermod -aG group user` |
| Files search karo | `find /path -name "*.log"` |
| Archive banao | `tar -czvf file.tar.gz /folder` |
| Disk usage dekho | `du -sh /path` |
| Soft link banao | `ln -s source destination` |
| Background mein chalao | `command &` |
| Foreground mein lao | `fg %1` |
| Process kill karo | `kill PID` ya `pkill naam` |

---

*📝 Banaya gaya: Linux Assignment Teaching Guide — Hinglish Edition*
*Padho, samjho, aur terminal khol ke khud try karo! Wohi best learning hai. 💪*