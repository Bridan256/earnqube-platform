@echo off
cd /d "C:\Users\User\Desktop\Vs Code\BridanPay"
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Fix: MTN merchant phone now uses Uganda number instead of Botswana"
"C:\Program Files\Git\cmd\git.exe" push
echo Done!