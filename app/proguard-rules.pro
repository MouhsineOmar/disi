# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/username/Library/Android/sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If you use an HTTP client like OkHttp, you might need rules like these:
# -keepattributes Signature
# -keepattributes *Annotation*
# -keep class com.squareup.okhttp3.** { *; }
# -keep interface com.squareup.okhttp3.** { *; }

# If you use GSON for JSON parsing:
# -keep class com.google.gson.stream.** { *; }

# For Vosk, if needed
# -keep class org.kaldi.** { *; }

# Add general proguard rules for common Android libraries.
-dontwarn okio.**
-dontwarn com.squareup.moshi.**
