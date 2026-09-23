/**
  Ali CNC Precision Post Processor for Mingda 1325 (NC Studio 5.5.60 & 8.x)
  Author: Raja Muhammad Ali Asghar (CEO, Ali CNC)
  Domain: alicnc.pk | Sector F-11 Islamabad
*/
description = "Ali CNC Mingda 1325 (NC Studio)";
vendor = "Ali CNC";
legal = "Copyright (c) 2026 Ali CNC. All rights reserved.";
certificationLevel = 2;
minimumRevision = 45000;

extension = "nc";
setCodePage("ascii");
capabilities = CAPABILITY_MILLING;
tolerance = spatial(0.002, MM);
minimumChordLength = spatial(0.25, MM);
minimumCircularRadius = spatial(0.01, MM);
maximumCircularRadius = spatial(1000, MM);
minimumCircularSweep = toRad(0.01);
maximumCircularSweep = toRad(180);
allowHelicalMoves = true;
allowedCircularPlanes = (1 << PLANE_XY); // G17 default
