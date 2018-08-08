using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Query;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.OData;
using Microsoft.EntityFrameworkCore;
using ODataService.Models;
using System.Net;

namespace ODataService.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class ProductsController : ODataController
    {
        private readonly ODataContext _context;

        public ProductsController(ODataContext context)
        {
            _context = context;
        }

        // GET: odata/Products
        public IActionResult GetProducts(ODataQueryOptions<Products> queryOptions)
        {
            // validate the query.
            try
            {
                var items = queryOptions.ApplyTo(_context.Products);
                return Ok(items);
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

           
        }

        // GET: odata/Products(5)
        public IActionResult GetProducts([FromODataUri] int key, ODataQueryOptions<Products> queryOptions)
        {
            // validate the query.
            try
            {
                var item = _context.Products.Find(key);
                if (item == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(item);
                }
            }
            catch (ODataException ex)
            {
                return BadRequest(ex.Message);
            }

         
        }

        // PUT: odata/Products(5)
        public IActionResult Put([FromODataUri] int key, [FromBody]Delta<Products> delta)
        {
            TryValidateModel(delta.GetInstance());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Get the entity here.
            var item = _context.Products.Find(key);
            if (item == null)
            {
                return NotFound();
            }
            delta.Put(item);

            // TODO: Save the patched entity.
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
             return Updated(item);
            //return StatusCode(HttpStatusCode.NotImplemented);
        }

        // POST: odata/Products
        public IActionResult Post([FromBody]Products products)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Add create logic here.
            if (!ProductsExists(products.Id))
            {
                return StatusCode((int)HttpStatusCode.BadRequest);
            }
         
            
                _context.Products.Add(products);
           
            int count = _context.SaveChanges();

            return Created(products);
            // return Created(products);
            //return StatusCode(HttpStatusCode.NotImplemented);
        }

        // PATCH: odata/Products(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IActionResult Patch([FromODataUri] int key, [FromBody]Delta<Products> delta)
        {
            TryValidateModel(delta.GetInstance());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // TODO: Get the entity here.
            var products = _context.Products.Find(key);
            if (products == null)
            {
                return NotFound();
            }
            // delta.Patch(products);
            delta.Patch(products);
            // TODO: Save the patched entity.
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(products);
            //return StatusCode(HttpStatusCode.NotImplemented);
        }

        // DELETE: odata/Products(5)
        public IActionResult Delete([FromODataUri] int key)
        {
            // TODO: Add delete logic here.
            Products item = _context.Products.Find(key);
            if (item == null)
            {
                return NotFound();
            }

            _context.Products.Remove(item);
            _context.SaveChanges();

            return StatusCode((int)HttpStatusCode.NoContent);
            // return StatusCode(HttpStatusCode.NoContent);
            //return StatusCode(HttpStatusCode.NotImplemented);
        }

        private bool ProductsExists(int key)
        {
            return _context.Products.Count(e => e.Id == key) > 0;
        }
    }
}