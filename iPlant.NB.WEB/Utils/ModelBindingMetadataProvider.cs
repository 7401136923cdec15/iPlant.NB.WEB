using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
namespace iPlant.NB.WEB.Utils
{
    public class ModelBindingMetadataProvider : IMetadataDetailsProvider, IDisplayMetadataProvider
    {
        public void CreateDisplayMetadata(DisplayMetadataProviderContext context)
        {
            if (context.Key.MetadataKind == ModelMetadataKind.Property)
            {
                context.DisplayMetadata.ConvertEmptyStringToNull = false;
            }
        }
    }
}
