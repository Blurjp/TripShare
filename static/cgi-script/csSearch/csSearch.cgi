#!/usr/bin/perl
#
$basepath = './';
# csSearch 2.6 - 052102
# 
#####################################################################
#                                                                   #
#    Copyright © 1999-2000 CGISCRIPT.NET - All Rights Reserved     #
#                                                                   #
#####################################################################
#                                                                   #
#          THIS COPYRIGHT INFORMATION MUST REMAIN INTACT            #
#                AND MAY NOT BE MODIFIED IN ANY WAY                 #
#                                                                   #
#####################################################################
#
# When you downloaded this script you agreed to accept the terms 
# of this Agreement. This Agreement is a legal contract, which 
# specifies the terms of the license and warranty limitation between 
# you and CGISCRIPT.NET. You should carefully read the following 
# terms and conditions before installing or using this software.  
# Unless you have a different license agreement obtained from 
# CGISCRIPT.NET, installation or use of this software indicates 
# your acceptance of the license and warranty limitation terms
# contained in this Agreement. If you do not agree to the terms of this
# Agreement, promptly delete and destroy all copies of the Software.
#
# Versions of the Software 
# Only one copy of the registered version of CGISCRIPT.NET 
# may used on one web site.
# 
# License to Redistribute
# Distributing the software and/or documentation with other products
# (commercial or otherwise) or by other than electronic means without
# CGISCRIPT.NET's prior written permission is forbidden.
# All rights to the CGISCRIPT.NET software and documentation not expressly
# granted under this Agreement are reserved to CGISCRIPT.NET.
#
# Disclaimer of Warranty
# THIS SOFTWARE AND ACCOMPANYING DOCUMENTATION ARE PROVIDED "AS IS" AND
# WITHOUT WARRANTIES AS TO PERFORMANCE OF MERCHANTABILITY OR ANY OTHER
# WARRANTIES WHETHER EXPRESSED OR IMPLIED.   BECAUSE OF THE VARIOUS HARDWARE
# AND SOFTWARE ENVIRONMENTS INTO WHICH CGISCRIPT.NET MAY BE USED, NO WARRANTY 
# OF FITNESS FOR A PARTICULAR PURPOSE IS OFFERED.  THE USER MUST ASSUME THE
# ENTIRE RISK OF USING THIS PROGRAM.  ANY LIABILITY OF CGISCRIPT.NET WILL BE
# LIMITED EXCLUSIVELY TO PRODUCT REPLACEMENT OR REFUND OF PURCHASE PRICE.
# IN NO CASE SHALL CGISCRIPT.NET BE LIABLE FOR ANY INCIDENTAL, SPECIAL OR
# CONSEQUENTIAL DAMAGES OR LOSS, INCLUDING, WITHOUT LIMITATION, LOST PROFITS
# OR THE INABILITY TO USE EQUIPMENT OR ACCESS DATA, WHETHER SUCH DAMAGES ARE
# BASED UPON A BREACH OF EXPRESS OR IMPLIED WARRANTIES, BREACH OF CONTRACT,
# NEGLIGENCE, STRICT TORT, OR ANY OTHER LEGAL THEORY. THIS IS TRUE EVEN IF
# CGISCRIPT.NET IS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO CASE WILL
# CGISCRIPT.NET' LIABILITY EXCEED THE AMOUNT OF THE LICENSE FEE ACTUALLY PAID
# BY LICENSEE TO CGISCRIPT.NET.
#
# Credits:
# Andy Angrick - Programmer - angrick@cgiscript.net
# Mike Barone - Design - mbarone@cgiscript.net
#
# For information about this script or other scripts see 
# http://www.cgiscript.net
#
# Thank you for trying out our script.
# If you have any suggestions or ideas for a new innovative script
# please direct them to suggest@cgiscript.net.  Thanks.
#
########################################################################
#                       Config Variables                               #
########################################################################

#
#####################################################################
#                                                                   #
#    Configuration variables                                        #
#                                                                   #
#####################################################################
(! -e "$basepath/setup.cgi")?($nosetup=1):(require("$basepath/setup.cgi"));
(!$htmlpath)&&($htmlpath=$cgipath);
(!$htmlurl)&&($htmlurl=$cgiurl);
$in{'htmlurl'} = $htmlurl;
$in{'cgiurl'} = $cgiurl."/csSearch.cgi";

$in{'cinfo'} = qq|
<p align="center"><font size=2 face=tahoma><b><a href="http://www.cgiscript.net"><font color="#3366FF" size="1">Powered
        by csSearch - © 2000,2001 CGIScript.net</font></a></b></font>
|;
#####################################################################
#                                                                   #
#    End Configuration Variables.                                   #
#                                                                   #
#####################################################################
require("$basepath/libs.cgi");


$| = 1;

eval { &main; }; 
if ($@) {
  print "fatal error: $@"; 
  }		
exit; 

sub main{
print "Content-type: text/html\n\n";
&getdata();
$in{'terms'} =~ s/([\\\|\(\)\[\]\{\}\^\$\*\+\?\.])/\\$1/g;
($in{'command'} eq '')&&($nosetup)&&(&Setup);
($in{'command'} eq '')&&(!$nosetup)&&(&ShowSearchForm);
($in{'command'} eq 'login')&&(&Login);
($in{'command'} eq 'query')&&(&Query);
($in{'command'} eq 'savesetup')&&(($nosetup)?(&SaveSetup):(&PError("Error. Permission denied.")));
#all require password below
&GetLogin;
($in{'command'} eq 'manage')&&(&Manage);
($in{'command'} eq 'aae')&&(&AddExtExcludes);
($in{'command'} eq 'ade')&&(&AddDirectoryExcludes);
($in{'command'} eq 'ae')&&(&AddIgnore);
($in{'command'} eq 'as')&&(&AddSkip);
($in{'command'} eq 'gu')&&(&GoUp);
($in{'action'} eq '-=Skip/UnSkip All Selected=-')&&(&SkipSelected);
($in{'action'} eq '-=Ignore/UnIgnore All Selected=-')&&(&IgnoreSelected);
($in{'command'} eq "showadv")&&($go=1)&&(&ShowAdv);
($in{'command'} eq "setstyles")&&(&SetStyles);
($in{'command'} eq "showcolor")&&($go=1)&&(&ShowColor);
($in{'command'} eq "setcolor")&&($go=1)&&(&SetColor);
($in{'command'} eq "index")&&($go=1)&&(&CreateIndexStart);
exit;
}

sub ShowAdv{
&GetAdvSettings;
$in{'S'.$in{'style'}}='checked';
(!$in{'extinc'})?($in{'EXTY'}='checked'):($in{'EXT'.$in{'extinc'}}='checked');
$in{'directlinks'} = qq|
<textarea name=L1 rows=2 cols=50>
<script language=javascript src="$in{'cgiurl'}?js=Y"></script>
</textarea> <input value="Grab Text" type=button onClick="form.L1.focus();form.L1.select()">
|;
$in{'directlinksnojs'} = qq|
<textarea name=L2 rows=2 cols=50>
$in{'cgiurl'}
</textarea> <input value="Grab Text" type=button onClick="form.L2.focus();form.L2.select()">
|;
&PageOut("$htmlpath/t_search_advanced_settings.htm");
exit;
}

sub GetAdvSettings{
(-e "$htmlpath/styles.pl")&&(require "$htmlpath/styles.pl");
}

sub ShowColor{
$in{'c'.$in{'cc'}} = checked;
&PageOut("$htmlpath/color_selector.htm");
exit;
}

sub SetColor{
open(ADV,"<$htmlpath/styles.pl");
open(TMP,">$htmlpath/styles.pl.tmp");
while(<ADV>){
(!/'\$in{'$in{'fieldname'}'}'/)&&(!/1;/)&&(print TMP $_); 
}
$in{'colorselect'} =~ s/\"//g;
$in{'colorselect'} =~ s/\\//g;
print TMP "\$in{'$in{'fieldname'}'} = \"$in{'colorselect'}\";\n1;\n";
close ADV;
close TMP;
@fi = stat("styles.pl.tmp");
rename("styles.pl.tmp","styles.pl") unless ($fi[7] < 1);
print <<"EOF";
<script language=javascript>
window.opener.location = "$in{'cgiurl'}?command=showadv&database=$in{'database'}";
window.close();
</script>
EOF
exit;
}


sub SetStyles{

open(STYLES,">$htmlpath/styles.pl")||die print "$!: styles.pl";
foreach $i (keys(%in)){
next if (($i eq 'command')||($i eq 'cgiurl'));
next if (($i eq 'UserName')||($i eq 'PassWord'));
next if (($i eq 'basemanageurl')||($i eq 'cinfo'));
next if (($i eq 'database')||($i eq 'imagedir'));
next if (($i eq 'imagerealdir')||($i eq 'images2'));
next if (($i eq 'format')||($i eq 'managementname'));
next if (($i eq 'managementuser')||($i eq 'managementemail'));
next if (($i eq 'exportdir')||($i eq 'managementemail'));
next if (($i eq 'htmlurl')||($i eq 'cgiurl'));
next if ($i eq 'terms');
$in{$i} =~ s/'//g;
$in{$i} =~ s/\\//g;
$in{$i} =~ s/\"//g;
print STYLES "\$in{'$i'}=\'$in{$i}\';\n";
}
print STYLES "1;\n";
close STYLES;
print<<"EOF";
<script language=javascript>
var rndURL = (1000*Math.random());
alert("Style has been changed.");
window.location = "$in{'cgiurl'}?command=manage&rnd="+rndURL;
</script>
EOF
exit;
}

sub Login{
&PageOut("$htmlpath/t_login.htm");
exit;
}

sub GetLogin{
&GetCookies;
$in{'UserName'} = $cookie{'UserName'};
$in{'PassWord'} = $cookie{'PassWord'};
if(!$in{'UserName'}){
&PageOut("$htmlpath/t_login.htm");
exit;
}
else{
(($in{'UserName'} ne $username)||(($in{'PassWord'} ne $password)))&&(&PError("Error. Invalid username or password"));
}
}

sub Query{
&GetAdvSettings;

if($in{'parsessi'}){
  require("$cgipath/ssi.cgi");
  }  
(!$in{'page'})&&($in{'page'} = 1);

(!$in{'terms'})&&(&PError("Error. Please enter something to search for."));

&LoadVars;
&GetGlobalIgnore;
chdir($rootpath);
&GetFiles(".");
##start actual search
  foreach $i (sort keys %ftsearch){
    &SearchFile($i); 
  }
(!$in{'count'})&&($in{'count'} = '0');
(!$in{'searchresults'})&&($in{'searchresults'} = '<br><font face=verdana size=2><b>Nothing found to match your query</b></font>');
$in{$in{'mcase'}} = 'selected';
$in{$in{'mbool'}} = 'selected';
$in{'count'} = $count;
$in{'count'} = "Your search returned <b>$in{'count'}</b> pages.";
&PageOut("$htmlpath/t_searchresults.htm");
exit;
}

sub CreateIndexStart{
print <<"EOF";
<script language=javascript>
alert("Indexing only available in csSearchPro!");
window.close();
</script>
EOF
exit;
}


sub SearchFile{

undef $/;
local($file) = @_;

open(FILE,"<$file")||print "$!:$file<br>";
$data = <FILE>;
close FILE;
$tdata = $data;

if($in{'parsessi'}){
&CheckForSSI;
}

&FormatPage;

if($in{'mbool'} eq 'AND'){
  if($in{'mcase'} eq 'Insensitive'){
    if($data =~ /$in{'terms'}/i){
      &DisplayFound;
      #print "Found: $in{'terms'}<br>";
      }
  }
  else{
    if($data =~ /$in{'terms'}/){
      &DisplayFound;
      #print "Found: $in{'terms'}<br>";
      }
  }
}
else{
  @aq = split(/\s+/,$in{'terms'});
  foreach $k (@aq){
    if($in{'mcase'} eq 'Insensitive'){
    
      if($data =~ /$k/i){
        &DisplayFound;
        #print "Found: $in{'terms'}<br>";
        }
    }
    else{
      if($data =~ /$k/){
        &DisplayFound;
        #print "Found: $in{'terms'}<br>";
        }
   }
  }
}

}

sub DisplayFound{
$data = $tdata;
$count++;
&OutputPage
}

sub DeHTML{
    #########################################################
    # next we'll remove all the <script> tags
    #########################################################
    $data =~ s/<script.*?<\/script>//gsix;
    #########################################################
    # next we'll remove all the <style> tags
    #########################################################
    $data =~ s/<style.*?<\/style>//gsix;
    #########################################################
    # remove <!-- comments -->
    #########################################################
    $data =~ s/\<!--.*?--\>//gesx;
    #########################################################
    # next we'll remove all the <tags>
    #########################################################
    $data =~ s/\<.*?\>//gsx;
    #########################################################
    #multiple returns 
    #########################################################
    $data =~ s/ {1,255}/ /sg;
    $data =~ s/\s{2,255}/\n/g;
    $data =~ s/\://g;
return;
}

sub GetFiles{
local($cdir) = @_;
local(@files);
local($i);
opendir(DIR,$cdir);
@files = readdir(DIR);
close DIR;
($cdir eq  '.')?($cdir=''):($cdir .= '/');
foreach $i (@files){
  next if ($i =~ /^\./);
  ($status,$wl) = &FindStatus("$cdir$i");
    if($wl eq 'searched'){
      if(-d "$cdir$i"){&GetFiles("$cdir$i")};
      if(-T "$cdir$i"){$ftsearch{"$cdir$i"}=1};
      }
  }

}

sub ShowSearchForm{
$mystyle = $in{'style'};
&GetAdvSettings;
($mystyle)?($style=$mystyle):($style=$in{'style'});

if($in{'js'} ne 'Y'){
  ($style eq '1')&&(&PageOut("$htmlpath/t_searchform.htm"));
  ($style eq '2')&&(&PageOut("$htmlpath/t_searchform1.htm"));
  ($style eq '3')&&(&PageOut("$htmlpath/t_searchform2.htm"));
  (!$style)&&(&PageOut("$htmlpath/t_searchform.htm"));
}
else{
  ($style eq '1')&&(&JSPageOut("$htmlpath/t_searchform.htm"));
  ($style eq '2')&&(&JSPageOut("$htmlpath/t_searchform1.htm"));
  ($style eq '3')&&(&JSPageOut("$htmlpath/t_searchform2.htm"));
  (!$style)&&(&JSPageOut("$htmlpath/t_searchform.htm"));
}
exit;
}

sub JSPageOut{
local($file) = @_;
open(OUT,"<$file")||print "$file: $!<br>";
while(<OUT>){
chomp;
$_ =~ s/in\((\w+)\)/$in{$1}/g;
$_ =~ s/\"/\\"/g;
$_ =~ s/\(/\\(/g;
$_ =~ s/\)/\\)/g;
$_ =~ s/script/scr\"\+\"ipt/gsi;
print "document.write(\"$_\");\n";
}
close OUT;
}

sub AddSkip{
&LoadVars;
($in{'cdir'})&&($cdir .='/');
$fts = "$in{'cdir'}$in{'f'}";
$fts =~ s/\/\//\//;

delete $ignore{$in{'f'}};

if(!$skip{$fts}){
$skip{$fts} = 1;
}
else{
delete $skip{$fts};
}

&WriteBackVars;
&Manage;
exit;
}

sub SkipSelected{
&LoadVars;
($in{'cdir'})&&($cdir .='/');
@skipped = split(/\\0/,$in{'fsel'});

foreach $s (@skipped){
$fts = "$in{'cdir'}$s";
$fts =~ s/\/\//\//;

delete $ignore{$s};

if(!$skip{$fts}){
$skip{$fts} = 1;
}
else{
delete $skip{$fts};
}
}

&WriteBackVars;
&Manage;
exit;
}

sub IgnoreSelected{
&LoadVars;
($in{'cdir'})&&($cdir .='/');
@ignored = split(/\\0/,$in{'fsel'});

foreach $s (@ignored){
$fts = "$in{'cdir'}$s";
$fts =~ s/\/\//\//;

delete $skip{$fts};

if(!$ignore{$s}){
$ignore{$s} = 1;
}
else{
delete $ignore{$s};
}

}

&WriteBackVars;
&Manage;
exit;
}


sub AddIgnore{
&LoadVars;
($in{'cdir'})&&($cdir .='/');
$fts = "$in{'cdir'}$in{'f'}";
$fts =~ s/\/\//\//;

delete $skip{$fts};

if(!$ignore{$in{'f'}}){
$ignore{$in{'f'}} = 1;
}
else{
delete $ignore{$in{'f'}};
}

&WriteBackVars;
&Manage;
exit;
}


sub WriteBackVars{
 #write all back to file
open(DB,">$htmlpath/g_skip.cgi");
foreach $i (keys %skip){
  print DB "$i\n";
}
close DB;


 #write all back to file
open(DB,">$htmlpath/g_ignore.cgi");
foreach $i (keys %ignore){
  print DB "$i\n";
}
close DB;

}

sub GetGlobalIgnore{

@tmp = split(/\s*,\s*/,$in{'efileext'});
foreach $i (@tmp){
  $i =~ tr/A-Z/a-z/;
  $i =~ s/^\.//;
  $efext{$i} = 1;
    if($i =~ /^\*/){
      $i =~ s/\*//;
      push(@efextrear,$i);
      }
    if($i =~ /\*$/){
      $i =~ s/\*//;
      push(@efextfront,$i);
      }
  }
  
}

sub GoUp{
#take off last directory
$in{'cdir'} =~ s/[^\/]*\/$//;
&Manage;
exit;
}

sub Manage{
&GetAdvSettings;
&GetGlobalIgnore;
&LoadVars;
##remove any excess '//'
$in{'cdir'} =~ s/\/\//\//;
chdir("$rootpath");
#if in subdir .. go to subdir
($in{'nd'})&&($in{'cdir'} = "$in{'cdir'}$in{'nd'}/");
($in{'cdir'})&&(chdir("$in{'cdir'}"));
##remove any excess '//'
$in{'currentdir'} =~ s/\/\//\//;
@allurl = split(/\//,$in{'cdir'});
foreach $x (@allurl){
$z .= "$x/";
$in{'currentdir'} .= "/<a href=\"javascript:JumpTo('$z')\">$x</a>";
}

$in{'currentdir'} = "/<a href=\"javascript:JumpTo('')\">[root]</a>$in{'currentdir'}";

##get dirs/files
opendir(DIR,".");
@all = readdir(DIR);
close DIR;
##read dirs
foreach $i (sort (@all)){
next if (! -d "$i");
next if ($i =~ /^\./);

#check to see if its a skipped
($status,$wl) = &FindStatus("$in{'cdir'}$i");
$il=$i;$il =~ s/'/\\'/g;

($wl eq 'searched')?($url="javascript:GoTo('$il')"):($url='javascript:NoGo()');
($wl eq 'ignored')?($bi = '-=UnIgnore=-'):($bi='-=Ignore=-');
($wl eq 'skipped')?($bs = '-=UnSkip=-'):($bs = '-=Skip=-');

$line = qq!<tr>
<td><a href="$url"><font face=tahoma size=2><input type=checkbox name=fsel value="$il"><img src="$htmlurl/images/folder.gif" border=0></a></td>
<td><a href="$url"><font color=#0000ff size=2 face=tahoma>$i</font></a></td>
<td align=center><font size=2 face=tahoma color=#FF0000><b>$status</td>
<td><font face=tahoma size=2><input type=button class=button value="$bs" onClick="Skip('$il')"><input type=button class=button value="$bi" onClick="Ignore('$il')"></td>
</tr>!;
($wl eq 'searched')&&($in{'directory'} .= $line);
($wl eq 'ignored')&&($in{'ignoredir'} .= $line);
($wl eq 'skipped')&&($in{'skipdir'} .= $line);
}
##read files
foreach $i (sort (@all)){
next if (-d "$i");
next if ($i =~ /^\./);

($status,$wl) = &FindStatus("$in{'cdir'}$i");
($wl eq 'ignored')?($bi = '-=UnIgnore=-'):($bi='-=Ignore=-');
($wl eq 'skipped')?($bs = '-=UnSkip=-'):($bs = '-=Skip=-');
$il=$i;$il =~ s/'/\\'/g;
$el="$in{'cdir'}/$i";$el=~ s/([^\w&=\/\.])/'%'.sprintf("%.2x",ord($1))/ge;$el =~ s/\/\//\//g;$el="$rooturl/$el";

$line = qq!<tr>
<td><font face=tahoma size=2><input type=checkbox name=fsel value="$il"><img src="$htmlurl/images/document.gif" border=0></td>
<td><a href="$el" target="_blank"><font color=#0000ff size=2 face=tahoma>$i</a></td>
<td align=center><font size=2 face=tahoma color=#FF0000><b>$status</td>
<td><font face=tahoma size=2><input type=button class=button value="$bs" onClick="Skip('$il')"><input type=button class=button value="$bi" onClick="Ignore('$il')"></td>
</tr>!;
($wl eq 'searched')&&($in{'files'} .= $line);
($wl eq 'ignored')&&($in{'ignorefiles'} .= $line);
($wl eq 'skipped')&&($in{'skipfiles'} .= $line);
}

(!$in{'ignorefiles'})&&(!$in{'ignoredir'})&&(!$in{'directory'})&&(!$in{'files'})&&($in{'files'} = "<tr><td colspan=4>Directory Empty</td></tr>");
(($in{'ignorefiles'})||($in{'ignoredir'}))&&($in{'ignoredir'} = "<tr><td colspan=4><b><font size=2 face=\"tahoma,Verdana\"><br>Ignored files and Directories</td></tr>\n$in{'ignoredir'}");
(($in{'skipfiles'})||($in{'skipdir'}))&&($in{'skipdir'} = "<tr><td colspan=4><b><font size=2 face=\"tahoma,Verdana\"><br>Skipped files and Directories</td></tr>\n$in{'skipdir'}");

(!$in{'style'})?($in{'S1'} = 'checked'):($in{'S'.$style} = 'checked');

&PageOut("$htmlpath/t_manage.htm");
exit;
}

sub LoadVars{
#load in skipped files
#print "In Load<br>";
#clear'm out
undef %skip;
undef %ignore;
open(DB,"<$htmlpath/g_skip.cgi");
while(<DB>){
  chomp;
  #print "\$skip{$_} = 1;<br>";
  $skip{$_} = 1;
  }
close DB;
open(DB,"<$htmlpath/g_ignore.cgi");
while(<DB>){
  chomp;
  #print "\$ignore{$_} = 1;<br>";
  $ignore{$_} = 1;
  }
close DB;
}

sub FindStatus{
local($file) = @_;
$ftc = "$file";
$file = &GetRealName($file);
($ext) = $file =~ /.*\.(\w*)$/;
$ext =~ tr /A-Z/a-z/;

if($skip{$ftc}){
$status = qq!<font size="2" face="tahoma,Verdana" color="#FF00FF"><b>Skipped</b></font>!;
$wl = 'skipped';
}
elsif($ignore{$file}){
$status = qq!<font size="2" face="tahoma,Verdana" color="#FF0000"><b>Ignored</b>!;
$wl='ignored';
}
elsif(($in{'extinc'} eq 'N')&&($efext{$ext})){
$status = qq!<font size="2" face="tahoma,Verdana" color="#FF00FF"><b>Skipped</b></font>!;
$wl = 'skipped';
}
elsif((! -d "$rootpath/$ftc")&&($in{'extinc'} eq 'Y')&&(!$efext{$ext})){
$status = qq!<font size="2" face="tahoma,Verdana" color="#FF00FF"><b>Skipped</b></font>!;
$wl = 'skipped';
}
else{
$status = qq!<font size="2" face="tahoma,Verdana" color="#008000"><b>Searched</b>!;
$wl='searched';
}

return $status,$wl;
}

sub GetRealName{
local($filename) = @_;
    if ($filename =~ /\//) {
	@array = split(/\//, $filename);
	$real_name = pop(@array);
    } elsif ($filename =~ /\\/) {
	@array = split(/\\/, $filename);
	$real_name = pop(@array);
    } else {
	$real_name = "$filename";
    }
return $real_name;
}

sub CheckForSSI{
($ssitest) = $data =~ /<!--#include\s+virtual=\"(.*?)\"\s*-->/i;
if($ssitest){
  $url = $file;
  $url =~ s/$rootpath\///;
  $url = "$rooturl/$url";
  #(print "F: $url I: $ssitest<br>");
  $data = RetrieveByURL($url);
  }
}

sub RetrieveByURL{
local($file) = @_;
local($data);
#print "In retreive by URL: $file<br>";

my $req = new HTTP::Request 'GET',$file;
my $res = $ua->request($req);
$data =  $res->content;
return $data;
}


sub Setup{
$cgipath = `pwd`;chomp $cgipath;
$cgiurl = "$ENV{'HTTP_HOST'}/$ENV{'SCRIPT_NAME'}";
$cgiurl =~ s/\/csSearch\.cgi//i;
$cgiurl =~ s/\/\//\//g;
$cgiurl = "http://".$cgiurl;
$rooturl = "http://$ENV{'HTTP_HOST'}";
$rootpath = "$ENV{'DOCUMENT_ROOT'}";

$setup = "\$cgiurl = '$cgiurl';
\$cgipath = '$cgipath';
\$rooturl = '$rooturl';
\$rootpath = '$rootpath';
\$username='demo';
\$password='demo';
1;
";

print <<"EOF";
<title>csSearch Setup</title>
<body>
<font size=4 face=tahoma><b>csSearch Setup</b></font><hr>
<font size=2 face=tahoma><b>Current contents of your setup.cgi file</b><br>Please verify the information and modify if needed:
<form method=post action="csSearch.cgi">
<input type=hidden name=command value=savesetup>
<textarea rows=10 cols=80 name=setup wrap=off>
$setup
</textarea>
<hr>
<input type=submit value="-=Save Changes=-">
</form>
<p><font face="Tahoma" size="2"><b>Definitions:</b></font></p>
<p><font face="Tahoma" size="2">\$cgiurl = Full URL to </font></font><font face="Tahoma" size="2">the
csSearch directory<font size=2 face=tahoma><br>
\$cgipath = Full PATH to the csSearch directory.<br>
\$rooturl = URL to your website<br>
\$rootpath = Full PATH to your document root<br>
\$username = username to enter management screens<br>
\$password = password to enter management screens</font></font><p><font size="2" face="tahoma">The
\$rootpath and \$rooturl must point to the same directory on your server and is
the point where the searching starts. For normal operations, this would be the
root directory of your website.</font><font face="Tahoma" size="2"><font size=2 face=tahoma>

<p><font face="Tahoma" size="2"><b>Normal Installation Instructions:</b></font></p>
<p><font face="Tahoma" size="2">In most cases, the script is already configured.
Change the \$username and \$password variables to your liking and click 'Save'.
If the setup portion of the script cannot find your site variables
automatically, you </font></font>will<font face="Tahoma" size="2"><font size=2 face=tahoma>
have to enter those in the above text area.</font></font> If you click 'save'
and you come back to this setup page, then your server doesn't have write access
to your directories. You can solve this problem by chmod'ing the csSearch
directory to 777.</p>
<p><b>WinNT installations:</b><br>
The script has been tested and works on an NT IIS webserver. You will, however,
have to manually enter the cgipath and rootpath variables. For example, your
rootpath might look something like 'c:/inetpub/wwwroot' (Note: the back-slashes
'\' normally associated with Window's file paths has been changed to a
forward-slash '/')</p>
<font size=2 face=tahoma>
<p><font face="Tahoma" size="2"><b>CGI-BIN Installation Instructions:</b></font></p>
</font><p>The preferred method is to install csSearch in a directory outside
your cgi-bin directory, however, i<font size=2 face=tahoma><font face="Tahoma" size="2">f your hosting service <b>will not</b> let
you
run scripts outside your <b>cgi-bin</b> directory, then follow these procedures:</font></p>
<p><font face="Tahoma" size="2">Copy all the *.cgi files to a directory in your
cgi-bin directory, making sure they are chmod'd to 755. For example, you could
create a /cgi-bin/csSearch/ directory and place csSearch.cgi, libs.cgi,
and setup.cgi </font></font>(<font face="Tahoma" size="2"><font size=2 face=tahoma>if this file
exists</font></font>) in this direcory<font size=2 face=tahoma><font face="Tahoma" size="2">.</font></p>
<p><font face="Tahoma" size="2">Create a directory outside your cgi-bin
directory and copy all the remaining files and subdirectories there. For
example, you could create a /cgi-script/csSearch and place the files there.</font></p>
<p><font face="Tahoma" size="2">Edit the above variables (or manually edit
setup.cgi) to the following:<br>
\$cgiurl = URL to the csSearch directory INSIDE your cgi-bin directory (where
the script is installed).<br>
\$cgipath = FULL PATH to the csSearch directory INSIDE your cgi-bin directory
(where the script is installed).<br>
<i><b>ADD THE FOLLOWING VARIABLES TO THE ABOVE CONFIGURATION OR MANUALLY EDIT
setup.cgi:<br>
</b></i>\$htmlurl =&nbsp; FULL URL to the csSearch directory OUTSIDE your cgi-bin
directory (where the rem</font></font>ainin<font size=2 face=tahoma><font face="Tahoma" size="2">g files where installed) <br>
\$htmlpath = FULL PATH to the csSearch directory OUTSIDE your cgi-bin
directory (where the</font></font><font face="Tahoma" size="2"> remaining</font><font size=2 face=tahoma><font face="Tahoma" size="2"> files where installed) <br>
For Example, your new setup.cgi file might look something like this:<br>
\$cgiurl='http://www.cgiscript.net/cgi-bin/csSearch';<br>
\$cgipath='/www/vhosts/cgiscript.net/cgi-bin/csSearch';<br>
\$htmlurl='http://www.cgiscript.net/cgi-script/csSearch';<br>
\$htmlpath='/www/vhosts/cgiscript.net/cgi-script/csSearch';<br>
\$rootpath='/www/vhosts/cgiscript.net';<br>
\$rooturl='http://www.cgiscript.net';<br>
\$username='myusername';<br>
\$password=',mypassword';<br>
1;</font></p>
<p><font face="Tahoma" size="2"><i>(note: the '1' at the end is to prevent
errors from perl if \$password was left empty)</i></font></p>
EOF

exit;
}

sub SaveSetup{
(-e "$basepath/setup.cgi")&&(&PError("Error. Access Denied"));
$in{'setup'} =~ s/\r*\n/\n/g;
open(SETUP,">$basepath/setup.cgi");
print SETUP $in{'setup'};
print SETUP "\n";
close SETUP;
print <<"EOF";
<script language=javascript>
alert("Setup.cgi reconfigured");
window.location = "csSearch.cgi?command=login";
</script>
EOF
exit;
}

sub ConvertForChars{

%fc = ('&Agrave','À', 
'&Ccedil','Ç',  
'&Aacute','Á', 
'&ccedil','ç',  
'&Acirc','Â',
'&Atilde','Ã', 
'&Egrave','È',  
'&Auml','Ä',
'&Eacute','É',  
'&Aring','Å',
'&Ecirc','Ê',
'&agrave','à',
'&Euml','Ë',
'&aacute','á',
'&egrave','è',  
'&acirc','â',
'&eacute','é',  
'&atilde','ã', 
'&ecirc','ê',
'&auml','ä',
'&euml','ë',
'&aring','å',
'&aelig','æ',
'&szlig','ß',
'&#170','ª',
'&Igrave','Ì', 
'&Ugrave','Ù',  
'&Iacute','Í', 
'&Uacute','Ú',  
'&Icirc','Î',
'&Ucirc','Û',
'&Iuml','Ï',
'&Uuml','Ü',
'&igrave','ì', 
'&ugrave','ù',  
'&iacute','í', 
'&uacute','ú',  
'&icirc','î',
'&ucirc','û',
'&iuml','ï',
'&uuml','ü',
'&Ntilde','Ñ', 
'&Ograve','Ò',  
'&ntilde','ñ', 
'&Oacute','Ó',  
'&Ocirc','Ô',
'&#161','¡',
'&Otilde','Õ',  
'&#191','¿',
'&Ouml','Ö',
'&Oslash','Ø',  
'&#171','«',
'&ograve','ò',  
'&#187','»',
'&oacute','ó',  
'&ocirc','ô',
'&#153','ô',
'&otilde','õ',  
'&#169','©',
'&ouml','ö',
'&#174','®',
'&#186','º',
'&nbsp','');

foreach $x (keys %fc){
$nc = $fc{$x};
$data =~ s/$x[;\s]/$nc/g;
}

}

sub FormatPage{
($title) = $data =~ /\<title\>(.+)\<\/title\>/i;
($keywords) = $data =~ /\<meta\s+name=\"keywords\"\s+content=\"(.+)\".*\>/i;
($description) = $data =~ /\<meta\s+name=\"description\"\s+content=\"(.+)\".*\>/i;
&DeHTML;
$data .= "$title\n$keywords\n$description";
&ConvertForChars;
}

sub OutputPage{

($title) = $data =~ /\<title\>(.+)\<\/title\>/i;

($keywords) = $data =~ /\<meta\s+name=\"keywords\"\s+content=\"(.+)\".*\>/i;

($description) = $data =~ /\<meta\s+name=\"description\"\s+content=\"(.+)\".*\>/i;

&DeHTML;

$data .= "$title\n$keywords\n$description";

#convert foreign characters

&ConvertForChars;

$title = sprintf("%.69s",$title);

($metadesc) = $description =~ /(\b.{1,150}\b)/s;

($metadesc)&&($metadesc = "<br><font size=2 face=verdana>Description: $metadesc</font>");
$description = $data;


$url = $file;
$url =~ s/$rootpath\///;
$url = "$rooturl/$url";
$rurl = $url;
$url = "javascript:var x=null;\" onClick=\"window.opener.location='$url';";

if($in{'mbool'} eq 'AND'){
  if($in{'mcase'} eq 'Insensitive'){
    ($description) = $description =~ /(\b.{1,100}$in{'terms'}.{1,100}\b)/si;
    $description =~ s/($in{'terms'})/<span class=\"hilite\">$1<\/span>/gsi;
  }
  else{
    ($description)= $description =~ /(\b.{1,100}$in{'terms'}.{1,100}\b)/s;
    $description =~ s/($in{'terms'})/<span class=\"hilite\">$1<\/span>/gs;
  }
}
else{
  @aq = split(/\s+/,$in{'terms'});
  if($in{'mcase'} eq 'Insensitive'){
  ($description) = $description =~ /(\b.{1,100}$aq[0].{1,100}\b)/si;
  foreach $k (@aq){
    $description =~ s/($k)/<span class=\"hilite\">$1<\/span>/gsi;
    }
  }
  else{
    ($description)= $description =~ /(\b.{1,100}$aq[0].{1,100}\b)/s;
    foreach $k (@aq){
    $description =~ s/($k)/<span class=\"hilite\">$1<\/span>/gs;
    }
  }
}

(!$description)&&($description = sprintf("%.200s",$data));
(!$title)&&($title='Untitled');



#########
$in{'searchresults'} .= qq!
        <p><font face="$in{'TitleTextFace'}" size="$in{'TitleTextSize'}" color="#$in{'TitleText'}">$count. <a href="$url">$title</a></font>
        $metadesc
        </p>
        <ul>
          <li><font face="$in{'ResultTextFace'}" size="$in{'ResultTextSize'}" color="#$in{'ResultText'}">$description</font></li>
          <li><font face="$in{'ResultTextFace'}" size="$in{'ResultTextSize'}" color="#$in{'ResultText'}">URL: <font color="#0000FF"><u><a href="$url">$rurl</a></u></font></font></li>
        </ul>
        !;


#############
$data='';
}
