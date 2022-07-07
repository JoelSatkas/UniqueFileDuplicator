'use strict';

const path = require('path');
const fs = require('fs');

let outPutDir = './OutPut'
let inPutDir = './Input'

console.log("Starting script.");

let rawConfig = fs.readFileSync('config.json');
let configObj = JSON.parse(rawConfig);

console.log("File config is:");
console.log(configObj);

if (!fs.existsSync(inPutDir))
{
    console.log("No input directory exists, exiting.");
	return;
}

if (!fs.existsSync(outPutDir))
{
    fs.mkdirSync(outPutDir);
}

fs.readdir(inPutDir, function (err, files) 
{
    //handling error
    if (err) 
	{
        console.log('Unable to scan directory: ' + err);
        return;
    } 
	
    let filePathToCopy  = "";
    let fileType = "";

    //listing all files using forEach
    files.forEach(function (file) 
	{
        let absolutePath = path.resolve(inPutDir, file);
        let lastDotIndex = file.lastIndexOf('.');
        let nameWithNoFileType = file.substring(0, lastDotIndex);

        if (nameWithNoFileType == configObj.originalName)
		{
            fileType = file.substring(lastDotIndex);
			filePathToCopy = absolutePath;
		}
    });

    if (filePathToCopy  == "")
    {
        console.log('Unable to find request file in input directory');
        return;
    }

    if (configObj.StartFrom > configObj.EndAt)
    {
        console.log('Starting from index is larger than ending index');
        return;
    }

    for (let index = configObj.StartFrom; index < configObj.EndAt; index++)
    {
        let destinationPath = path.resolve(outPutDir, configObj.originalName + '_' + index + fileType);
        // File destination.txt will be created or overwritten by default.
        fs.copyFileSync(filePathToCopy, destinationPath);
        console.log(filePathToCopy + ' -> ' + destinationPath);
    }

    console.log('Finished');
});

