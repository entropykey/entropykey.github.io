---
title: Proper Factory reset
date: 2025-10-29
---


**In this blog i'll explain how to properly wipe data off your android phone before you sell it or give it to anyone else.**

## Prerequisites
-  A linux pc with `adb`
- USB cable (which supports data transfer)
- Backup your stuff
- Have your phone charged above 50%

## Remove accounts & disable lock screen (preventing FRP)
Remove the google accounts and the OEM accounts. Disable the lock screen and set it to none.

## Check encryption state

```bash
adb shell getprop ro.crypto.state
```
if the output says `encrypted` = good to go
if the output says `unencrypted` = try to enable it if available in settings

## Fill internal storage and then nuke it
We have to overwrite free space on the user partition by copying large files into `/sdcard`, then delete them.
- random file set on linux
```bash
dd if=/dev/urandom of=~/bigfile.bin bs=1M count=1024 status=progress
```

- now run this script until you fill the android
```bash
#!/bin/bash
FILE=~/bigfile.bin
i=1
echo "Pushing random files until device reports full..."
while true; do
  echo "Pushing copy #$i..."
  if adb push "$FILE" /sdcard/bigfile_${i}.bin >/dev/null 2>&1; then
    i=$((i+1))
  else
    echo "Push failed — likely full. Stopping."
    break
  fi
done
```
## Show free space
``` bash
adb shell df -h /sdcard || true
```
don't forget to use `chmod +x` to make it executable

## Remove the junk now
remove the files we just pushed
```bash
adb shell rm /sdcard/bigfile_*.bin
```

now reboot
```bash
adb reboot
```

Now perform a factory reset how you normally would and you're all done.

## Jackpot 
> Lucky for you i have an automated script for that.
> You can find the script [here](https://github.com/entropykey/factryreset)

You have to enable usb-debugging in developers settings.
then check if the device is recognized

```bash
adb devices
```
![Screenshot1](/images/adb-devices.png)

and when it shows the device just run the script with

```bash
sudo ./wipe.sh 
```

![Screenshot2](/images/wiping-1.png)
![Screenshot3](/images/wiping-2.png)

it pushes the 1gb files to the device till it fills up and then you can do the factory reset via ui as you normally do.
