﻿namespace ODataSamples.CustomFormatService.Formaters.VCard
{
    using System;
    using System.IO;
    using System.Text;
    using Microsoft.OData.Core;
    using Microsoft.OData.Edm;

    internal class VCardOutputContext : ODataOutputContext
    {
        private Stream outputStream;
        private VCardWriter writer;

        internal VCardOutputContext(
            ODataFormat format,
            Stream messageStream,
            Encoding encoding,
            ODataMessageWriterSettings messageWriterSettings,
            bool writingResponse,
            bool synchronous,
            IEdmModel model,
            IODataUrlResolver urlResolver)
            : base(format, messageWriterSettings, writingResponse, synchronous, model, urlResolver)
        {
            this.writer = new VCardWriter(new StreamWriter(messageStream, new UTF8Encoding(false)));
            this.outputStream = messageStream;
        }

        public override void WriteProperty(ODataProperty property)
        {
            var val = property.Value as ODataComplexValue;
            if (val == null)
            {
                throw new ApplicationException("only support write complex type property.");
            }

            this.writer.WriteStart();
            foreach (ODataProperty prop in val.Properties)
            {
                string name = null;
                string @params = string.Empty;

                int idx = prop.Name.IndexOf('_');
                if (idx < 0)
                {
                    name = prop.Name;
                }
                else
                {
                    name = prop.Name.Substring(0, idx);
                    @params = string.Join(";", prop.Name.Substring(idx + 1).Split('_'));
                }

                foreach (ODataInstanceAnnotation anns in prop.InstanceAnnotations)
                {
                    @params += ";" + anns.Name.Substring(6) /*VCARD.*/ + "=" + ((ODataPrimitiveValue)anns.Value).Value;
                }

                this.writer.WriteItem(null, name, @params, (string)prop.Value);
            }

            this.writer.WriteEnd();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                try
                {
                    if (this.outputStream != null)
                    {
                        this.outputStream.Flush();
                        this.outputStream.Dispose();
                    }

                }
                finally
                {
                    this.outputStream = null;
                }
            }

            base.Dispose(disposing);
        }
    }
}
