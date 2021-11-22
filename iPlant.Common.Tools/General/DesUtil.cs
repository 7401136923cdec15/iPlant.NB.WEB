using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace iPlant.Common.Tools
{

    public class DesUtil
    {
        private const String AppSecret = "c5e33021";


        public static string Encrypt(string originalValue)
        {
            return Encrypt(originalValue, AppSecret);
        }

        public static string Decrypt(string originalValue)
        {
            return Decrypt(originalValue, AppSecret);
        }

        /// <summary>
        /// C# DES加密方法
        /// </summary>
        /// <param name="encryptedValue">要加密的字符串</param>s
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns>加密后的字符串</returns>
        public static string Encrypt(string originalValue, String wKey)
        {
            if (String.IsNullOrWhiteSpace(originalValue))
                return "";
            if (StringUtils.isEmpty(wKey) || wKey.Length < 8 || wKey.Length > 50)
                return originalValue;
            wKey = wKey.Substring(0, 8);


            using (DESCryptoServiceProvider sa
                = new DESCryptoServiceProvider
                {
                    Key = Encoding.UTF8.GetBytes(wKey),
                    IV = Encoding.UTF8.GetBytes(wKey)
                })
            {
                sa.Padding = PaddingMode.PKCS7;//补位
                sa.Mode = CipherMode.ECB;

                using (ICryptoTransform ct = sa.CreateEncryptor())
                {
                    byte[] by = Encoding.UTF8.GetBytes(originalValue);
                    using (var ms = new MemoryStream())
                    {
                        using (var cs = new CryptoStream(ms, ct,
                                                         CryptoStreamMode.Write))
                        {
                            cs.Write(by, 0, by.Length);
                            cs.FlushFinalBlock();
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        /// <summary>
        /// C# DES解密方法
        /// </summary>
        /// <param name="encryptedValue">待解密的字符串</param>
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns>解密后的字符串</returns>
        public static string Decrypt(string encryptedValue, String wKey)
        {
            if (String.IsNullOrWhiteSpace(encryptedValue))
                return "";

            if (StringUtils.isEmpty(wKey) || wKey.Length < 8 || wKey.Length > 50)
                return encryptedValue;
            wKey = wKey.Substring(0, 8);

            using (DESCryptoServiceProvider sa =
                new DESCryptoServiceProvider { Key = Encoding.UTF8.GetBytes(wKey), IV = Encoding.UTF8.GetBytes(wKey) })
            {
                sa.Padding = PaddingMode.PKCS7;//补位
                sa.Mode = CipherMode.ECB;

                using (ICryptoTransform ct = sa.CreateDecryptor())
                {
                    byte[] byt = Convert.FromBase64String(encryptedValue);

                    using (var ms = new MemoryStream())
                    {
                        using (var cs = new CryptoStream(ms, ct, CryptoStreamMode.Write))
                        {
                            cs.Write(byt, 0, byt.Length);
                            cs.FlushFinalBlock();
                        }
                        return Encoding.UTF8.GetString(ms.ToArray());
                    }
                }
            }
        }





        /// <summary>
        /// C# DES加密方法
        /// </summary>
        /// <param name="encryptedValue">要加密的字符串</param>s
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns>加密后的字符串</returns>
        public static string encrypt(string originalValue, String wKey)
        {
            if (String.IsNullOrWhiteSpace(originalValue))
                return "";
            if (StringUtils.isEmpty(wKey) || wKey.Length < 8 || wKey.Length > 50)
                return originalValue;
            wKey = wKey.Substring(0, 8);


            using (DESCryptoServiceProvider sa
                = new DESCryptoServiceProvider
                {
                    Key = Encoding.UTF8.GetBytes(wKey),
                    IV = Encoding.UTF8.GetBytes(wKey)
                })
            {
                sa.Padding = PaddingMode.PKCS7;//补位
                sa.Mode = CipherMode.ECB;

                using (ICryptoTransform ct = sa.CreateEncryptor())
                {
                    byte[] by = Encoding.UTF8.GetBytes(originalValue);
                    using (var ms = new MemoryStream())
                    {
                        using (var cs = new CryptoStream(ms, ct,
                                                         CryptoStreamMode.Write))
                        {
                            cs.Write(by, 0, by.Length);
                            cs.FlushFinalBlock();
                        }
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        /// <summary>
        /// C# DES解密方法
        /// </summary>
        /// <param name="encryptedValue">待解密的字符串</param>
        /// <param name="key">密钥</param>
        /// <param name="iv">向量</param>
        /// <returns>解密后的字符串</returns>
        public static string decrypt(string encryptedValue, String wKey)
        {
            if (String.IsNullOrWhiteSpace(encryptedValue))
                return "";

            if (StringUtils.isEmpty(wKey) || wKey.Length < 8 || wKey.Length > 50)
                return encryptedValue;
            wKey = wKey.Substring(0, 8);

            using (DESCryptoServiceProvider sa =
                new DESCryptoServiceProvider { Key = Encoding.UTF8.GetBytes(wKey), IV = Encoding.UTF8.GetBytes(wKey) })
            {
                sa.Padding = PaddingMode.PKCS7;//补位
                sa.Mode = CipherMode.ECB;

                using (ICryptoTransform ct = sa.CreateDecryptor())
                {
                    byte[] byt = Convert.FromBase64String(encryptedValue);

                    using (var ms = new MemoryStream())
                    {
                        using (var cs = new CryptoStream(ms, ct, CryptoStreamMode.Write))
                        {
                            cs.Write(byt, 0, byt.Length);
                            cs.FlushFinalBlock();
                        }
                        return Encoding.UTF8.GetString(ms.ToArray());
                    }
                }
            }
        }



    }






}