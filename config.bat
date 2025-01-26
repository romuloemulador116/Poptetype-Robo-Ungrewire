@echo off
del sdram.ini
del sdram.abs
del eromclient.abs
del  EROM_SW1.abs
if "%1"=="8M_PF" goto 8M_PF
if "%1"=="8M_SF" goto 8M_SF
if "%1"=="8M_SF_S3202" goto 8M_SF_S3202
if "%1"=="16M_SF_S3202" goto 16M_SF_S3202
if "%1"=="8M_SF_S3202_SQI" goto 8M_SF_S3202_SQI
if "%1"=="8M_SF_27G4_SQI" goto 8M_SF_27G4_SQI
if "%1"=="32M_SF_S3202" goto 32M_SF_S3202
if "%1"=="16M_SF_M3329E" goto 16M_SF_M3329E
if "%1"=="32M_SF_M3329D" goto 32M_SF_M3329D
if "%1"=="128M_SF_M3602" goto 128M_SF_M3602
if "%1"=="128M_SF_M3603" goto 128M_SF_M3603
if "%1"=="128M_SF_M3606" goto 128M_SF_M3606
if "%1"=="64M_SF_M3601E" goto 64M_SF_M3601E
if "%1"=="128M_SF_M3811" goto 128M_SF_M3811
if "%1"=="64M_SF_M3503" goto 64M_SF_M3503
if "%1"=="DDR2_128M_SF_M3503" goto DDR2_128M_SF_M3503
if "%1"=="128M_SF_M3503" goto 128M_SF_M3503
if "%1"=="DDR2_64M_SF_M3503C" goto DDR2_64M_SF_M3503C
if "%1"=="256M_SF_M3616" goto 256M_SF_M3616
if "%1"=="64M_SF_M3618" goto 64M_SF_M3618
if "%1"=="DDR2_128M_SF_M3618" goto DDR2_128M_SF_M3618
if "%1"=="64M_SF_M3821" goto 64M_SF_M3821
if "%1"=="128M_SF_M3821" goto 128M_SF_M3821
if "%1"=="128M_SF_M3822" goto 128M_SF_M3822
if "%1"=="128M_SF_M3823" goto 128M_SF_M3823
if "%1"=="64M_SF_M3823" goto 64M_SF_M3823
if "%1"=="DDR3_128M_SF_M3505_BGA_M3527" goto DDR3_128M_SF_M3505_BGA_M3527
if "%1"=="DDR3_128M_SF_M3505_LQFP_M3526" goto DDR3_128M_SF_M3505_LQFP_M3526
if "%1"=="DDR3_256M_SF_M3505_LQFP_M3526" goto DDR3_256M_SF_M3505_LQFP_M3526
if "%1"=="DDR2_64M_SF_M3821B" goto DDR2_64M_SF_M3821B
if "%1"=="DDR3_128M_SF_M3821B" goto DDR3_128M_SF_M3821B
echo config.bat [platform_type]
echo platform = 8M_PF, 8M_SF, 8M_SF_S3202, 8M_SF_S3202_SQI, 16M_SF_M3329E
echo Examples:
echo For 8M SDRAM, Serial Flash Platform: config.bat 8M_SF
echo For 8M SDRAM, Parallel Flash Platform: config.bat 8M_PF
echo For 8M SDRAM, Serial Flash Platform S3202: config.bat 8M_SF_S3202
echo For 16M SDRAM, Serial Flash Platform S3202: config.bat 16M_SF_S3202
echo For 8M SDRAM, SQI Serial Flash Platform S3202: config.bat 8M_SF_S3202_SQI
echo For 8M SDRAM, SQI Serial Flash Platform S3327G4: config.bat 8M_SF_27G4_SQI
echo For 32M SDRAM, Serial Flash Platform S3202: config.bat 32M_SF_S3202
echo For 16M SDRAM, Serial Flash Platform M3329E: config.bat 16M_SF_M3329E
echo For 32M DDRAM, Serial Flash Platform M3329D: config.bat 32M_SF_M3329D
echo For 128M DDRAM, Serial Flash Platform M3602: config.bat 128M_SF_M3602
echo For M3603 DDRAM, Serial Flash Platform M3603: config.bat 128M_SF_M3603
echo For M3606 DDRAM, Serial Flash Platform M3606: config.bat 128M_SF_M3606
echo For M3601E DDRAM, Serial Flash Platform M3601E: config.bat 64M_SF_M3601E
echo For M3811 DDRAM, Serial Flash Platform M3811: config.bat 128M_SF_M3811
echo For M3503 DDRAM 64M DDR2, Serial Flash Platform M3503: config.bat 64M_SF_M3503
echo For M3503 DDRAM 128M DDR2, Serial Flash Platform M3503: config.bat DDR2_128M_SF_M3503
echo For M3503 DDRAM 128M DDR3, Serial Flash Platform M3503: config.bat 128M_SF_M3503
echo For M3503C DDRAM 64M DDR2, Serial Flash Platform M3503C: config.bat DDR2_64M_SF_M3503C
echo For M3616 256M DDRAM, Serial Flash Platform M3616: config.bat 256M_SF_M3616
echo For M3618 64M DDRAM, Serial Flash Platform M3618: config.bat 64M_SF_M3618
echo For M3618 DDRAM 128M DDR2, Serial Flash Platform M3618: config.bat DDR2_128M_SF_M3618
echo For M3821 64M DDRAM, Serial Flash Platform M3821: config.bat 64M_SF_M3821
echo For M3821 128M DDRAM, Serial Flash Platform M3821: config.bat 128M_SF_M3821
echo For M3822 128M DDRAM, Serial Flash Platform M3822: config.bat 128M_SF_M3822
echo For M3823 128M DDRAM, Serial Flash Platform M3823: config.bat 128M_SF_M3823
echo For M3823 64M DDRAM, Serial Flash Platform M3823: config.bat 64M_SF_M3823
echo For M3527 DDRAM 128M, Serial Flash Platform M3505: config.bat DDR3_128M_SF_M3505_BGA_M3527
echo For M3526 DDRAM 128M, Serial Flash Platform M3505: config.bat DDR3_128M_SF_M3505_LQFP_M3526
echo For M3526 DDRAM 256M, Serial Flash Platform M3505: config.bat DDR3_256M_SF_M3505_LQFP_M3526
echo For M3821B DDRAM 64M, Serial Flash Platform M3821B: config.bat DDR2_64M_SF_M3821B
echo For M3821B DDRAM 128M, Serial Flash Platform M3821B: config.bat DDR3_128M_SF_M3821B

goto End

:8M_PF
copy/y sdram_8M.ini sdram.ini
copy/y eromclient_8M_pf.abs eromclient.abs
goto End

:8M_SF
copy/y sdram_8M.ini sdram.ini
copy/y eromclient_8M_sf.abs eromclient.abs
goto End

:8M_SF_S3202
copy/y sdram_8M_S3202.ini sdram.ini
copy/y eromclient_8M_sf.abs eromclient.abs
goto End

:16M_SF_S3202
copy/y sdram_16M_S3202.ini sdram.ini
copy/y eromclient_16M_sf.abs eromclient.abs
goto End

:8M_SF_S3202_SQI
copy/y sdram_8M_S3202.ini sdram.ini
copy/y eromclient_8M_sf_SQI.abs eromclient.abs
goto End

:8M_SF_27G4_SQI
copy/y sdram_8M.ini sdram.ini
copy/y eromclient_8M_sf_27G4_SQI.abs eromclient.abs
goto End

:32M_SF_S3202
copy/y sdram_32M_S3202.ini sdram.ini
copy/y eromclient_32M_sf.abs eromclient.abs
goto End

:16M_SF_M3329E
copy/y sdram_16M.ini sdram.ini
copy/y eromclient_16M_sf.abs eromclient.abs
goto End

:32M_SF_M3329D
copy/y ddr_32M_S3329E5.ini sdram.ini
copy/y eromclient_32mddr_sf.abs eromclient.abs
goto End

:128M_SF_M3602
copy/y ddram_128M_32bit_M3602.ini sdram.ini
copy/y eromclient_128M_32bit_sf.abs eromclient.abs
goto End

:128M_SF_M3603
copy/y ddr_128M_M3603.ini sdram.ini
copy/y eromclient_M3603.abs eromclient.abs
goto End

:128M_SF_M3606
copy/y ddr_128M_M3606.ini sdram.ini
copy/y eromclient_M3606.abs eromclient.abs
goto End

:64M_SF_M3601E
copy/y ddr_64M_M3601E.ini sdram.ini
copy/y eromclient_M3606.abs eromclient.abs
goto End

:128M_SF_M3811
copy/y ddr_128M_M3811.ini sdram.ini
copy/y eromclient_M3811.abs eromclient.abs
goto End

:64M_SF_M3503
copy/y ddr_64M_M3503.ini sdram.ini
copy/y eromclient_M3503.abs eromclient.abs
goto End

:DDR2_128M_SF_M3503
copy/y ddr2_128M_M3503.ini sdram.ini
copy/y eromclient_M3503.abs eromclient.abs
goto End


:128M_SF_M3503
copy/y ddr_128M_M3503.ini sdram.ini
copy/y eromclient_M3503.abs eromclient.abs
goto End

:DDR2_64M_SF_M3503C
copy/y EROM_SW1_C3503C_64M_DDR2.abs EROM_SW1.abs
copy/y eromclient_c3503c.abs eromclient.abs
goto End
:256M_SF_M3616
copy/y ddr_256M_M3616.abs sdram.abs
copy/y eromclient_M3616.abs eromclient.abs
goto End

:64M_SF_M3618
copy/y ddr_64M_M3618.ini sdram.ini
copy/y eromclient_M3811.abs eromclient.abs
goto End
:DDR2_128M_SF_M3618
copy/y ddr2_128M_M3618.ini sdram.ini
copy/y eromclient_M3811.abs eromclient.abs
goto End

:128M_SF_M3821
copy/y ddr_128M_M3821.ini sdram.ini
copy/y eromclient_M3821.abs eromclient.abs
goto End

:128M_SF_M3822
copy/y ddr_128M_M3822.ini sdram.ini
copy/y eromclient_M3821.abs eromclient.abs
goto End

:64M_SF_M3821
copy/y ddr2_64M_M3821.ini sdram.ini
copy/y eromclient_M3821.abs eromclient.abs
goto End

:128M_SF_M3823
copy/y ddr_128M_M3823.ini sdram.ini
copy/y eromclient_M3821.abs eromclient.abs
goto End

:64M_SF_M3823
copy/y ddr2_64M_M3823.ini sdram.ini
copy/y eromclient_M3821.abs eromclient.abs
goto End

:DDR3_128M_SF_M3505_BGA_M3527
copy/y C3505_EROM_SW1_800MHz_128M_BGA_release.abs EROM_SW1.abs
copy/y eromclient_c3505.abs eromclient.abs
goto End

:DDR3_128M_SF_M3505_LQFP_M3526
copy/y C3505_EROM_SW1_800MHz_128M_LQFP_release.abs EROM_SW1.abs
copy/y eromclient_c3505.abs eromclient.abs
goto End

:DDR3_256M_SF_M3505_LQFP_M3526
copy/y C3505_EROM_SW1_800MHz_256M_LQFP_release.abs EROM_SW1.abs
copy/y eromclient_c3505.abs eromclient.abs
goto End

:DDR2_64M_SF_M3821B
copy/y C3821B_EROM_SW1_DDR2_800MHz_64M_LQFP_release.abs EROM_SW1.abs
copy/y eromclient_C3821B.abs eromclient.abs
goto End

:DDR3_128M_SF_M3821B
copy/y C3821B_EROM_SW1_DDR3_800MHz_128M_LQFP_release.abs EROM_SW1.abs
copy/y eromclient_C3821B.abs eromclient.abs
goto End

:End
