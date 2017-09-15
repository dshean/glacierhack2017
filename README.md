# glacierhack2017
Code and notes for the 2017 UW eScience geohackweek GlacierHack project.

**See the [wiki](https://github.com/dshean/glacierhack2017/wiki) for results**

## Objectives
- To learn new skills to work with large raster datasets, specifically high-resolution DEMs
- Learn how to calcluate elevation change, volume change, and geodetic mass balance from DEM time series
- Explore options to integrate DEM time series into Google Earth Engine
- Explore options to implement various processing steps in Google Earth Engine or other cloud-based processing platform

## Sub-projects (see [wiki](https://github.com/dshean/glacierhack2017/wiki) for results!)

### Geodetic mass balance
Lead(s): @spectorp, @mattols

### Feature-tracking and velocity map time series
Lead(s): @willkochtitzky @prajjwalpanday

We will explore [vmap](https://github.com/dshean/vmap) tools (wrappers around the Ames Stereo Pipeline correlator) to generate time series of velocity maps.  

Sources of input data for velocity maps include:
- High-resolution image data from DigitalGlobe, Planet, LS8, Sentinel, etc.
- High-resolution shaded relief maps derived from 2-m Stereo DEMs (see

### Debris thickness and insolation modeling
Lead(s): @drounce, @tarynblack, @mattols

Attempt to estimate debris thickness using LS thermal IR imagery, output from an energy balance model, and observed elevation change data

### Lagrangian elevation change for mountain glaciers
Lead(s): @dshean 

Integrate elevation change and velocity measurements to extract Lagrangian Dh/Dt and local debris thickness change maps for comparison with debris thickness models.

## Candidate sites
Let's identify one or more sites with a good, dense time series of DEM/image data.  See count maps and indices.

### High-mountain Asia
![HMA mosaic](doc/hma_20170716_mos_32m_100m_proj_combined_lbl_sm.jpg)
Index of available DEMs: https://drive.google.com/open?id=0B5c3UTO8DDZwNkktcGtBSXJvQjQ

### Pacific NW (Mt. Rainier, Mt. Baker, Mt Olympus, etc.)
![PNW mosaic](doc/pnw_dem_mosaic_countmap_timeseries_sm.jpg)
Index of available DEMs: https://drive.google.com/file/d/0B5c3UTO8DDZwNDFvWkQ0bFdsa0U

## Background material
- Raster processing ghw2017 tutorial: https://geohackweek.github.io/raster/
- Rainier DEM example: https://geohackweek.github.io/raster/06-pygeotools_rainier/
- GDAL API reference: (http://www.gdal.org/gdal_tutorial.html)

## Packages
- [GDAL](http://www.gdal.org/)
- [NumPy](http://www.numpy.org/)
- [Matplotlib](https://matplotlib.org/)
- [pygeotools](https://github.com/dshean/pygeotools)
- [demcoreg](https://github.com/dshean/demcoreg)
- [vmap](https://github.com/dshean/vmap)
- [Ames Stereo Pipeline](https://ti.arc.nasa.gov/tech/asr/intelligent-robotics/ngt/stereo/)

### Notes on ASP Install

1. Download the latest [ASP binaries](https://ti.arc.nasa.gov/tech/asr/intelligent-robotics/ngt/stereo/) for your operating system (Linux or OS X). For bleeding edge, see the daily builds.
2. Extract: tar -xzvf StereoPipeline-*-x86_64-*.tar.gz (filling in the appropriate filename)
3. Move the extracted folder to a location on your system where you store executables (e.g., bindir="~/sw" or bindir="/usr/local/bin"): mv StereoPipeline-*-x86_64-*/ $bindir
4. Add the ASP bin subdirectory to your path. In bash: export PATH=${PATH}:$bindir/StereoPipeline-*-x86_64-*/bin. To make this permanent, add that line to your ~/.bashrc or ~/.bash_profile.

