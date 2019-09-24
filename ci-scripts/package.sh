#!/bin/bash
echo "Creating Dist..."
[ -d target/ ] && rm -rf target/
mkdir target
echo "Moving Project Files.."
cp ci-scripts target/
cp *.js target/
cp README.md target/
cp package*.json target/
echo "Adding Copyright Header..."
read -d '' LICENSE << EOF
  All components of this product are Copyright (c) 2015-$CURRENT_YEAR Contrast Security, Inc. All rights reserved.

  Certain inventions disclosed in this file may be claimed within patents owned or patent applications filed by Contrast Security, Inc. or third parties.

  This product is provided subject to a license agreement between Contrast and you. All license grants and usage rights, including all license restrictions, regarding this product are identified therein. As a condition to the foregoing grant, you must provide this notice along with each copy you distribute and you must not remove, alter, or obscure this notice. In the event you submit or provide any feedback, code, pull requests, or suggestions to Contrast Security you hereby grant Contrast Security a worldwide, non-exclusive, irrevocable, transferrable, fully paid-up license to use the code, algorithms, patents, and ideas therein in our products.
EOF

echo "Creating license..."
echo "$LICENSE" > target/LICENSE

read -d '' copyright << EOF
/**
$LICENSE
*/
EOF


for file in `find target -name "*.js"`; do
	read -r firstline<"${file}"
	bang="#!/usr/bin/env node"
	if [ "$firstline" == "$bang" ]
	then
		printf '%s\n' H 1a "$copyright" . wq | ed -s "${file}"
	else
		printf '%s\n' H 0a "$copyright" . wq | ed -s "${file}"
	fi
done

echo -e "Packing Module...\n"
cd target/
npm ci --production
npm pack
